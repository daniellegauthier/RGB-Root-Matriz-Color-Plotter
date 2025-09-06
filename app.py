import os, re
from typing import Dict, Tuple, List

import nltk, spacy, torch, pandas as pd, matplotlib.pyplot as plt
import torch.nn.functional as F
import gradio as gr
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer, util

# -------------------- setup --------------------
def ensure_spacy():
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        import spacy.cli
        spacy.cli.download("en_core_web_sm")
        return spacy.load("en_core_web_sm")

def ensure_nltk():
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt")

ensure_nltk()
nlp = ensure_spacy()

sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
bert_sentiment = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

emotion_model_name = "j-hartmann/emotion-english-distilroberta-base"
emotion_tokenizer = AutoTokenizer.from_pretrained(emotion_model_name)
emotion_model = AutoModelForSequenceClassification.from_pretrained(emotion_model_name)

# -------------------- constants --------------------
CSV_PATH_PLUS  = "la matrice plus.csv"   # pathways + colors + template words
CSV_PATH_COLOR = "la matrice.csv"        # color lexicon

SEQUENCE_ALIASES = {
    "Direct": "direct",
    "Feminine": "feminine",
    "Knot": "knot",
    "Masculine": "masculine",
    "Pain": "pain",
    "Prayer": "prayer",
    "Precise": "precise",
    "Practical": "practical",
    "Plot": "plot",
    "Spiritual": "spiritual",
    "Sad": "sad",
}

SEQUENCE_IMAGE_FILES = {
    "direct": "direct pathway.png",
    "feminine": "fem pathway.png",
    "knot": "knot pathway.png",
    "masculine": "masc pathway.png",
    "pain": "pain pathway.png",
    "prayer": "prayer pathway.png",
    "precise": "precise pathway.png",
    "practical": "practical pathway.png",
    "plot": "plot pathway.png",
    "spiritual": "spiritual pathway.png",
    "sad": "sad pathway.png"
}

GNH_DOMAINS: Dict[str, str] = {
    "Mental Wellness": "mental health, emotional clarity, peace of mind",
    "Social Wellness": "relationships, community, friendship, social harmony",
    "Economic Wellness": "income, savings, financial stability, cost of living",
    "Workplace Wellness": "career, work-life balance, promotion, productivity",
    "Physical Wellness": "physical health, sleep, fitness, exercise",
    "Environmental Wellness": "green space, nature, environmental care",
    "Health": "healthcare, medical care, recovery, well-being",
    "Education Value": "learning, education, school, knowledge, wisdom",
    "Good Governance": "freedom, justice, fairness, democratic participation",
    "Living Standards": "housing, wealth, basic needs, affordability",
    "Cultural Diversity": "tradition, language, cultural expression, heritage",
    "Political Wellness": "rights, law, free speech, civic participation",
    "Ecological Diversity": "biodiversity, forest, ecosystem, wildlife",
}

GNH_COLORS: Dict[str, str] = {
    "Economic Wellness": "#808080",
    "Mental Wellness": "#ffc0cb",
    "Workplace Wellness": "#ffd700",
    "Physical Wellness": "#f5deb3",
    "Social Wellness": "#ffa500",
    "Political Wellness": "#ffffff",
    "Environmental Wellness": "#87ceeb",
    "Ecological Diversity": "#228B22",
    "Health": "#ff6347",
    "Good Governance": "#000000",
    "Education Value": "#8b4513",
    "Living Standards": "#ffff00",
    "Cultural Diversity": "#9370db",
}

WORD_MODES = ["Matrice1", "Matrice", "English", "GNH Indicators"]
MAX_COLORS = 8

# -------------------- loaders --------------------
def _find_col(df: pd.DataFrame, candidates: List[str]) -> str | None:
    names = {c.lower(): c for c in df.columns}
    for c in candidates:
        if c.lower() in names: return names[c.lower()]
    for want in candidates:
        ww = want.replace(" ", "").replace("-", "")
        for lc, orig in names.items():
            if ww in lc.replace(" ", "").replace("-", ""):
                return orig
    return None

def load_pathway_info(csv_path_plus: str):
    df = pd.read_csv(csv_path_plus)
    keys = set(SEQUENCE_ALIASES.values())
    rows = df[df["color"].astype(str).str.lower().isin(keys)].copy()

    seq_to_colors: Dict[str, List[str]] = {}
    seq_phrase: Dict[str, str] = {}

    # colors live in 'r' (list), template = concat of the other fields
    cols_for_phrase = [c for c in df.columns if c not in ("color", "r", "g", "b")]
    for _, row in rows.iterrows():
        key = str(row["color"]).strip().lower()
        color_list = str(row.get("r", "") or "")
        colors = [c.strip().lower() for c in re.split(r"[,\s]+", color_list) if c.strip()]
        seq_to_colors[key] = list(dict.fromkeys(colors))

        vals = []
        for c in cols_for_phrase:
            v = row.get(c)
            if pd.notna(v):
                s = str(v).strip()
                if s and s.lower() != "nan":
                    vals.append(s)
        phrase = " ".join(" ".join(vals).split())  # base template
        seq_phrase[key] = phrase

    return seq_to_colors, seq_phrase

def _split_words(s: str) -> List[str]:
    if not isinstance(s, str): return []
    parts = re.split(r"[,\;/\|\s]+", s.strip())
    return [p for p in (w.strip().lower() for w in parts) if p]

def load_color_lexicon(csv_path_color: str):
    df = pd.read_csv(csv_path_color)
    color_col = _find_col(df, ["color", "colour"])
    m1_col = _find_col(df, ["matrice1", "matrice 1"])
    m_col  = _find_col(df, ["matrice"])
    en_col = _find_col(df, ["english-words-code", "english words code", "english_words_code", "english"])

    lex: Dict[str, Dict[str, List[str]]] = {}
    for _, row in df.iterrows():
        cname = str(row.get(color_col, "")).strip().lower()
        if not cname: continue
        lex[cname] = {
            "matrice1": _split_words(str(row.get(m1_col, ""))),
            "matrice":  _split_words(str(row.get(m_col,  ""))),
            "english":  _split_words(str(row.get(en_col, ""))),
        }
    return lex

SEQ_TO_COLORS, SEQ_PHRASE = load_pathway_info(CSV_PATH_PLUS)
COLOR_LEX = load_color_lexicon(CSV_PATH_COLOR)

def sequence_to_image_path(seq_key: str) -> str | None:
    fname = SEQUENCE_IMAGE_FILES.get(seq_key)
    return fname if (fname and os.path.exists(fname)) else None

# -------------------- NLP helpers --------------------
def encode_text(t: str):
    return sbert_model.encode(t, convert_to_tensor=True)

def classify_emotion(text: str) -> Tuple[str, float]:
    inputs = emotion_tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = emotion_model(**inputs).logits
        probs = F.softmax(logits, dim=1).squeeze()
    labels = emotion_model.config.id2label
    idx = int(torch.argmax(probs).item())
    return labels[idx], float(probs[idx].item())

def score_sentiment(text: str) -> float:
    out = bert_sentiment(text[:512])[0]
    label, score = out["label"], out["score"]
    scaled = 5 + 5 * score if label == "POSITIVE" else 1 + 4 * (1 - score)
    return round(min(10, max(1, scaled)), 2)

def score_accomplishment(text: str) -> float:
    doc = nlp(text); score = 5.0
    key_phrases = {"finally","told","decided","quit","refused","stood","walked","walked away","returned","return"}
    for token in doc:
        if token.text.lower() in key_phrases: score += 1.5
        if token.tag_ in {"VBD","VBN"}:       score += 0.5
    return round(min(10, max(1, score)), 2)

def semantic_indicator_mapping(text: str, sentiment_score: float, sentiment_weight: float = 0.3) -> Dict[str, float]:
    v = encode_text(text)
    out: Dict[str, float] = {}
    for dom, desc in GNH_DOMAINS.items():
        sim = float(util.cos_sim(v, encode_text(desc)).item())
        sim = max(0.0, min(1.0, sim))
        blended = (1 - sentiment_weight) * sim + sentiment_weight * (sentiment_score / 10.0)
        out[dom] = round(blended, 3)
    return dict(sorted(out.items(), key=lambda kv: -kv[1]))

def indicators_plot(indicators: Dict[str, float]):
    labels = list(indicators.keys()); values = list(indicators.values())
    colors = [GNH_COLORS.get(label, "#cccccc") for label in labels]
    fig = plt.figure(figsize=(8,5))
    plt.barh(labels, values, color=colors)
    plt.gca().invert_yaxis()
    plt.title("GNH Indicator Similarity")
    plt.xlabel("Score")
    plt.tight_layout()
    return fig

# -------------------- prompt building (legible placeholders) --------------------
def join_all_words(color: str) -> List[str]:
    d = COLOR_LEX.get(color.lower(), {})
    return list(dict.fromkeys(d.get("matrice1", []) + d.get("matrice", []) + d.get("english", [])))

def nearest_gnh_domain_for_color(color: str) -> Tuple[str, float]:
    words = " ".join(join_all_words(color))
    if not words:
        return "Mental Wellness", 0.0
    v = encode_text(words)
    best, best_sim = None, -1.0
    for dom, desc in GNH_DOMAINS.items():
        sim = float(util.cos_sim(v, encode_text(desc)).item())
        if sim > best_sim:
            best, best_sim = dom, sim
    return best or "Mental Wellness", best_sim

def labels_for_mode(colors: List[str], mode: str) -> List[str]:
    if mode.lower().startswith("gnh"):
        return [nearest_gnh_domain_for_color(c)[0] for c in colors]
    return [c.capitalize() for c in colors]

def placeholder_for(color: str, mode: str) -> str:
    """
    Always show a meaningful placeholder driven by the chosen mode.
    """
    color_lc = color.lower()
    if mode.lower().startswith("gnh"):
        dom, _ = nearest_gnh_domain_for_color(color_lc)
        return f"{dom}: {GNH_DOMAINS.get(dom, '')}"

    # map mode -> CSV column key
    mode_key = {
        "matrice1": "matrice1",
        "matrice":  "matrice",
        "english":  "english",
    }.get(mode.lower(), "matrice")

    lex = COLOR_LEX.get(color_lc, {})
    primary = lex.get(mode_key, [])

    # If the chosen column has entries, use them.
    if primary:
        return ", ".join(primary[:12])

    # Otherwise, try the other two lexicon columns (ordered).
    fallback_order = [k for k in ("matrice1", "matrice", "english") if k != mode_key]
    for fb in fallback_order:
        words = lex.get(fb, [])
        if words:
            label = "Matrice1" if fb == "matrice1" else ("Matrice" if fb == "matrice" else "English")
            return f"(from {label}) " + ", ".join(words[:12])

    # Final fallback: mapped GNH domain description (still a “meaning”, just not from lexicon).
    dom, _ = nearest_gnh_domain_for_color(color_lc)
    return f"(mapped GNH) {dom}: {GNH_DOMAINS.get(dom, '')}"


def simple_color_legend(colors: List[str]) -> str:
    if not colors:
        return "No prompts available for this pathway."
    parts = []
    for c in colors:
        dot = f"<span style='display:inline-block;width:10px;height:10px;border-radius:50%;background:{c};margin-right:8px;border:1px solid #999;vertical-align:middle'></span>"
        parts.append(f"<div style='margin:4px 0'>{dot}<b>{c.capitalize()}</b></div>")
    return "<div>" + "".join(parts) + "</div>"

def colors_for_sequence(seq_key: str) -> List[str]:
    return SEQ_TO_COLORS.get(seq_key, [])

def update_prompt_ui(seq_choice: str, word_mode: str):
    key = SEQUENCE_ALIASES.get(seq_choice)
    colors = colors_for_sequence(key)
    labels = labels_for_mode(colors, word_mode)
    legend_html = simple_color_legend(colors)

    updates = []
    for i in range(MAX_COLORS):
        if i < len(colors):
            lab = labels[i] if i < len(labels) else f"Input {i+1}"
            ph  = placeholder_for(colors[i], word_mode)
            updates.append(gr.update(visible=True, label=f"{lab} meaning", placeholder=ph, value=""))
        else:
            updates.append(gr.update(visible=False, value="", label=f"Input {i+1}", placeholder="—"))
    return (legend_html, *updates)

# -------------------- template replacement --------------------
def render_phrase_template(base_phrase: str, colors: List[str], labels: List[str], inputs: List[str]) -> str:
    """
    Replace occurrences of '<color>-pathway' (any spacing/hyphen variants) with the user's phrase for that color.
    If user left it empty, keep the label (color name or mapped GNH indicator).
    Finally, append a compact legend ' // Label: input'.
    """
    text = base_phrase or ""
    # build replacement map color -> replacement text
    rep: Dict[str, str] = {}
    for color, label, user in zip(colors, labels, inputs):
        use = user.strip() if isinstance(user, str) and user.strip() else label
        rep[color.lower()] = use

    # replace each token case-insensitively
    for color, replacement in rep.items():
        # match 'brown-pathway', 'brown pathway', 'Brown- Pathway', etc.
        pattern = re.compile(rf"\b{re.escape(color)}\s*-\s*pathway\b", re.IGNORECASE)
        text = pattern.sub(replacement, text)

    # if the template had no tokens, fall back to readable construction:
    # "use A to B the C of D as a new E" is preserved, but we still append meanings
    suffix_parts = []
    for color, label, user in zip(colors, labels, inputs):
        if isinstance(user, str) and user.strip():
            suffix_parts.append(f"{label}: {user.strip()}")
    if suffix_parts:
        text = (text + " // " + " // ".join(suffix_parts)).strip()

    return text

# -------------------- main analysis --------------------
def analyze(text: str, seq_choice: str, word_mode: str, *color_inputs):
    key = SEQUENCE_ALIASES.get(seq_choice)
    if key not in SEQ_PHRASE:
        return (5.0, "neutral (0.0)", 5.0, "Choose a valid pathway.", "{}", None, None, f"{seq_choice} (unavailable)",
                *update_prompt_ui(seq_choice, word_mode))

    colors = colors_for_sequence(key)
    labels = labels_for_mode(colors, word_mode)
    base_phrase = SEQ_PHRASE.get(key, "")

    # updated phrase with template replacement
    user_inputs = list(color_inputs)[:len(colors)]
    updated_phrase = render_phrase_template(base_phrase, colors, labels, user_inputs)

    # analysis on original + updated
    combined_text = " ".join([t for t in [text, updated_phrase] if t and t.strip()])
    sentiment = score_sentiment(combined_text)
    emotion, emo_conf = classify_emotion(combined_text)
    accomplishment = score_accomplishment(combined_text)

    indicators = semantic_indicator_mapping(combined_text, sentiment_score=sentiment)
    fig = indicators_plot(indicators)
    top5 = list(indicators.items())[:5]
    top5_str = "\n".join(f"{k}: {v}" for k, v in top5)

    img_path = sequence_to_image_path(key)
    meta = f"{key} | colors: {', '.join(colors) if colors else '—'}"
    emo_str = f"{emotion} ({emo_conf:.3f})"

    # keep prompt area synced
    prompt_updates = update_prompt_ui(seq_choice, word_mode)

    return (
        sentiment, emo_str, accomplishment,
        updated_phrase, top5_str, fig, img_path, meta,
        *prompt_updates
    )

# -------------------- UI --------------------
SEQ_CHOICES = list(SEQUENCE_ALIASES.keys())
DEFAULT_SEQ = "Knot" if "Knot" in SEQ_CHOICES else SEQ_CHOICES[0]

with gr.Blocks(title="RGB Root Matriz Color Plotter") as demo:
    gr.Markdown("## RGB Root Matriz Color Plotter\n"
                "Type a phrase. Choose a **Sequence** or keep **Auto** to recommend a pathway. "
                "You’ll get sentiment, emotion, accomplishment, GNH bars, and the pathway phrase + image from the dataset.")

    with gr.Row():
        inp = gr.Textbox(lines=4, label="Your situation / obstacle", placeholder="Describe the situation...")

    with gr.Row():
        seq = gr.Dropdown(choices=SEQ_CHOICES, value=DEFAULT_SEQ, label="Pathway")
        word_mode = gr.Radio(choices=WORD_MODES, value="Matrice", label="Word Mode")

    legend = gr.HTML()

    color_boxes: List[gr.Textbox] = []
    for i in range(MAX_COLORS):
        color_boxes.append(gr.Textbox(visible=False, label=f"Input {i+1}", placeholder="—"))

    run = gr.Button("Generate Pathway Analysis", variant="primary")

    with gr.Row():
        sent = gr.Number(label="Sentiment (1–10)")
        emo  = gr.Text(label="Emotion")
        acc  = gr.Number(label="Accomplishment (1–10)")

    with gr.Row():
        phrase_out = gr.Text(label="Updated Pathway Phrase (template with your meanings)")
        gnh_top    = gr.Text(label="Top GNH Indicators (Top 5)")

    gnh_plot = gr.Plot(label="GNH Similarity")
    img_out  = gr.Image(label="Pathway image", type="filepath")
    meta_out = gr.Text(label="Chosen pathway / colors")

    def _update_ui(seq_choice, mode):
        return update_prompt_ui(seq_choice, mode)

    seq.change(fn=_update_ui, inputs=[seq, word_mode], outputs=[legend, *color_boxes])
    word_mode.change(fn=_update_ui, inputs=[seq, word_mode], outputs=[legend, *color_boxes])

    run.click(
        fn=analyze,
        inputs=[inp, seq, word_mode, *color_boxes],
        outputs=[sent, emo, acc, phrase_out, gnh_top, gnh_plot, img_out, meta_out, legend, *color_boxes],
    )

    demo.load(fn=_update_ui, inputs=[seq, word_mode], outputs=[legend, *color_boxes])

if __name__ == "__main__":
    demo.launch()

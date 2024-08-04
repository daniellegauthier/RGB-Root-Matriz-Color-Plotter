import pandas as pd
import numpy as np

# Load the CSV file
data = pd.read_csv(r"C:\Users\fuzzy\OneDrive\Documents\Python Portfolio\la matrice.csv")

# Function to calculate dot product of two RGB colors
def dot_product(color1, color2):
    return np.dot(color1, color2)

# Function to calculate similarity percentile
def similarity_percentile(dot_product, max_dot_product):
    return (dot_product / max_dot_product) * 100

# Calculate dot products for all color pairs and self-pairs
colors = data.dropna(subset=['r', 'g', 'b'])
dot_products = {}
max_dot_product = 0

for i in range(len(colors)):
    for j in range(i, len(colors)):
        color1 = colors.iloc[i]
        color2 = colors.iloc[j]
        dp = dot_product([color1['r'], color1['g'], color1['b']], [color2['r'], color2['g'], color2['b']])
        dot_products[(color1['color'], color2['color'])] = dp
        if dp > max_dot_product:
            max_dot_product = dp

# Displaying the table with questions
print(data[['color', 'r', 'g', 'b', 'matrice']])

# Asking for user input
color1_input = input("Enter the first color: ")
color2_input = input("Enter the second color: ")

dp = dot_products.get((color1_input, color2_input)) or dot_products.get((color2_input, color1_input))
if dp is not None:
    similarity = similarity_percentile(dp, max_dot_product)
    print(f"Dot product between {color1_input} and {color2_input}: {dp}")
    print(f"Similarity percentile: {similarity}%")
else:
    print("Invalid color inputs.")

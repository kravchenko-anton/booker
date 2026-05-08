import json

def get_psychology_books(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    psychology_titles = [
        book['title'] for book in data 
        if 'categories' in book and 'psychology' in [c.lower() for c in book['categories']]
    ]
    
    return psychology_titles

if __name__ == "__main__":
    titles = get_psychology_books('allbooks.json')
    for title in titles:
        print(title)

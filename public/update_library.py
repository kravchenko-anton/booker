import json

TO_REMOVE = [
    "The Tipping Point", "Blink", "Outliers", "What the Dog Saw",
    "The Power of Habit", "Smarter Faster Better",
    "You Are Not So Smart", "The Hidden Brain", "Subliminal",
    "What Makes Your Brain Happy and Why You Should Do the Opposite",
    "Brain Rules", "Rapt", "Focus", "Willpower",
    "Being Wrong", "Attached", "Hold Me Tight", "Going Solo",
    "Emotional Blackmail", "Switch", "Decisive",
    "Thinking in Bets", "How to Decide",
    "The Awakened Family", "Divergent Mind", "Reviving Ophelia",
    "The Drama of the Gifted Child", "The Overachievers",
    "The Upward Spiral", "The Anatomy of Anxiety",
    "The Mindful Way Through Depression",
    "Love's Executioner", "The Gift of Therapy",
    "Cognitive Behavior Therapy", "Predictably Irrational",
    "The Bell Curve", "Lost Connections", "After", "Spook",
    "Flim-Flam!", "Words and Rules", "The Stuff of Thought",
    "The Sense of Style", "Authentic Happiness",
    "Stumbling on Happiness", "The Geography of Bliss",
    "Mindsight", "50 Great Myths of Popular Psychology"
]

NEW_BOOKS = [
    {
        "title": "The Emotional Brain: The Mysterious Underpinnings of Emotional Life",
        "author": "Joseph E. LeDoux",
        "rating": 4.07,
        "ratings_count": 3000,
        "credibility": 85,
        "expert": True,
        "populist": False,
        "author_note": "Нейронаука страха и эмоциональной памяти. Один из самых цитируемых нейробиологов, фундаментальная работа которой нет в списке",
        "goodreads_url": "https://www.goodreads.com/book/show/157291.The_Emotional_Brain",
        "genres": ["Psychology", "Neuroscience", "Science", "Nonfiction", "Biology"],
        "description": "This book investigates the origins of human emotions, explaining that many exist as part of complex neural systems evolved for survival. LeDoux explores the brain mechanisms underlying emotions like fear, love, and anger.",
        "year": 1996,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388177570i/157291.jpg",
        "categories": ["biology"]
    },
    {
        "title": "Livewired: The Inside Story of the Ever-Changing Brain",
        "author": "David Eagleman",
        "rating": 4.16,
        "ratings_count": 5400,
        "credibility": 85,
        "expert": True,
        "populist": False,
        "author_note": "Нейропластичность в 2020 году — значительно глубже и современнее чем The Brain that Changes Itself",
        "goodreads_url": "https://www.goodreads.com/book/show/53231812-livewired",
        "genres": ["Science", "Nonfiction", "Neuroscience", "Psychology", "Biology"],
        "description": "Eagleman introduces the term 'livewired' to describe how the brain reconfigures itself, adjusts, and adapts to its environment, presenting a new framework for understanding neuroplasticity.",
        "year": 2020,
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1589401431i/53231812.jpg",
        "categories": ["biology"]
    },
    {
        "title": "The Principles of Psychology",
        "author": "William James",
        "rating": 3.98,
        "ratings_count": 5000,
        "credibility": 95,
        "expert": True,
        "populist": False,
        "author_note": "Абсолютный исторический фундамент. Практически вся современная психология берет начало из трудов Уильяма Джеймса.",
        "goodreads_url": "https://www.goodreads.com/book/show/367430.The_Principles_of_Psychology",
        "genres": ["Psychology", "Philosophy", "Nonfiction", "Science", "Classics"],
        "description": "First published in 1890, this monumental work is a cornerstone of modern psychology and philosophy. It explores topics including habit, emotion, memory, and the self.",
        "year": 1890,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388191253i/367430.jpg",
        "categories": ["psychology"]
    },
    {
        "title": "Science and Human Behavior",
        "author": "B.F. Skinner",
        "rating": 4.03,
        "ratings_count": 1888,
        "credibility": 90,
        "expert": True,
        "populist": False,
        "author_note": "База бихевиоризма. Невозможно изучать психологию, не понимая принципов оперантного обусловливания, заложенных Скиннером.",
        "goodreads_url": "https://www.goodreads.com/book/show/11721.Science_and_Human_Behavior",
        "genres": ["Psychology", "Science", "Nonfiction", "Philosophy", "Sociology", "Classics"],
        "description": "A psychology classic that provides a detailed study of scientific theories of human nature and how environmental conditions influence actions.",
        "year": 1953,
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348621563i/11721.jpg",
        "categories": ["psychology"]
    },
    {
        "title": "Thought and Language",
        "author": "Lev Vygotsky",
        "rating": 4.23,
        "ratings_count": 963,
        "credibility": 90,
        "expert": True,
        "populist": False,
        "author_note": "Классика возрастной психологии и психолингвистики, признанная во всем мире.",
        "goodreads_url": "https://www.goodreads.com/book/show/173136.Thought_and_Language",
        "genres": ["Psychology", "Philosophy", "Linguistics", "Nonfiction", "Language"],
        "description": "Vygotsky analyzes the relationship between words and consciousness, arguing that speech is social in its origins and becomes internalized verbal thought.",
        "year": 1934,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348398457i/173136.jpg",
        "categories": ["psychology"]
    },
    {
        "title": "The Psychology of the Child",
        "author": "Jean Piaget",
        "rating": 3.87,
        "ratings_count": 1061,
        "credibility": 90,
        "expert": True,
        "populist": False,
        "author_note": "Фундамент когнитивного развития детей.",
        "goodreads_url": "https://www.goodreads.com/book/show/158447.The_Psychology_of_the_Child",
        "genres": ["Psychology", "Nonfiction", "Education", "Child Psychology"],
        "description": "The definitive account of renowned psychologist Jean Piaget's work on children's cognitive development from infancy to adolescence.",
        "year": 1966,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388191776i/158447.jpg",
        "categories": ["psychology"]
    },
    {
        "title": "Man and His Symbols",
        "author": "Carl Jung",
        "rating": 4.18,
        "ratings_count": 34800,
        "credibility": 90,
        "expert": True,
        "populist": False,
        "author_note": "Теоретическая работа, объясняющая аналитическую психологию доступным языком.",
        "goodreads_url": "https://www.goodreads.com/book/show/123632.Man_and_His_Symbols",
        "genres": ["Psychology", "Philosophy", "Nonfiction", "Science", "Mythology", "Classics"],
        "description": "The first and only work in which Carl Jung explains his influential theory of symbolism and the unconscious mind to the layperson.",
        "year": 1964,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388182747i/123632.jpg",
        "categories": ["psychology"]
    },
    {
        "title": "Games People Play",
        "author": "Eric Berne",
        "rating": 3.71,
        "ratings_count": 41000,
        "credibility": 80,
        "expert": True,
        "populist": False,
        "author_note": "База трансактного анализа, перевернувшая взгляд на межличностные коммуникации и сценарии поведения.",
        "goodreads_url": "https://www.goodreads.com/book/show/49176.Games_People_Play",
        "genres": ["Psychology", "Nonfiction", "Self Help", "Sociology", "Relationships"],
        "description": "Berne identifies various 'games' that people use to avoid intimacy or reinforce their life scripts, foundational for Transactional Analysis.",
        "year": 1964,
        "image": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348270542i/49176.jpg",
        "categories": ["psychology"]
    }
]

def update_library(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter out books
    original_count = len(data)
    updated_data = [
        book for book in data
        if not any(rem.lower() in book['title'].lower() for rem in TO_REMOVE)
    ]
    removed_count = original_count - len(updated_data)
    
    # Add new books
    updated_data.extend(NEW_BOOKS)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, ensure_ascii=False, indent=2)
    
    print(f"Removed {removed_count} books. Added {len(NEW_BOOKS)} books.")
    print(f"Final count: {len(updated_data)}")

if __name__ == "__main__":
    update_library('allbooks.json')

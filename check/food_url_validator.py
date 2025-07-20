import requests
import json
from typing import List, Dict
import time

# Votre liste d'aliments (complétée avec les données manquantes)
healthyFoods = [
    # --- Fruits (10 items) ---
    {
        'name': 'Apple',
        'category': 'Fruits',
        'caloriesPer100g': 52,
        'proteinPer100g': 0.3,
        'carbsPer100g': 14,
        'fatPer100g': 0.2,
        'photoUrl': 'https://organicmandya.com/cdn/shop/files/Apples_bf998dd2-0ee8-4880-9726-0723c6fbcff3.jpg?v=1721368465&width=1000.jpg'
    },
    {
        'name': 'Blueberries',
        'category': 'Fruits',
        'caloriesPer100g': 57,
        'proteinPer100g': 0.7,
        'carbsPer100g': 14,
        'fatPer100g': 0.3,
        'photoUrl': 'https://foodmarble.com/more/wp-content/uploads/2021/09/joanna-kosinska-4qujjbj3srs-unsplash-scaled.jpg'
    },
    {
        'name': 'Banana',
        'category': 'Fruits',
        'caloriesPer100g': 89,
        'proteinPer100g': 1.1,
        'carbsPer100g': 23,
        'fatPer100g': 0.3,
        'photoUrl': 'https://images.stockcake.com/public/a/d/0/ad0a90cf-519e-4dc9-81d7-44268609ed3a_large/ripe-banana-peeled-stockcake.jpg'
    },
    {
        'name': 'Strawberries',
        'category': 'Fruits',
        'caloriesPer100g': 33,
        'proteinPer100g': 0.7,
        'carbsPer100g': 8,
        'fatPer100g': 0.3,
        'photoUrl': 'https://cdn11.bigcommerce.com/s-kc25pb94dz/images/stencil/1280w/products/255/721/Strawberries__57434.1657116605.jpg'
    },
    {
        'name': 'Orange',
        'category': 'Fruits',
        'caloriesPer100g': 47,
        'proteinPer100g': 0.9,
        'carbsPer100g': 12,
        'fatPer100g': 0.1,
        'photoUrl': 'https://www.fervalle.com/wp-content/uploads/2022/07/transparent-orange-apple5eacfeae85ac29.7815306015883956945475.png'
    },
    {
        'name': 'Avocado',
        'category': 'Fruits',
        'caloriesPer100g': 160,
        'proteinPer100g': 2,
        'carbsPer100g': 9,
        'fatPer100g': 15,
        'photoUrl': 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
    },
    {
        'name': 'Grapes',
        'category': 'Fruits',
        'caloriesPer100g': 69,
        'proteinPer100g': 0.6,
        'carbsPer100g': 18,
        'fatPer100g': 0.2,
        'photoUrl': 'https://farmfreshfundraising.com/wp-content/uploads/2017/10/271156-grapes.jpg'
    },
    {
        'name': 'Mango',
        'category': 'Fruits',
        'caloriesPer100g': 60,
        'proteinPer100g': 0.8,
        'carbsPer100g': 15,
        'fatPer100g': 0.4,
        'photoUrl': 'https://example.com/invalid-url.jpg'  # URL invalide pour test
    }
]

def is_valid_image_url(url: str, timeout: int = 10) -> bool:
    """
    Vérifie si une URL pointe vers une image valide.
    
    Args:
        url (str): L'URL à vérifier
        timeout (int): Timeout en secondes pour la requête
    
    Returns:
        bool: True si l'URL est valide et pointe vers une image, False sinon
    """
    try:
        # Headers pour simuler un navigateur
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Faire une requête HEAD pour vérifier sans télécharger tout le contenu
        response = requests.head(url, headers=headers, timeout=timeout, allow_redirects=True)
        
        # Vérifier le code de statut
        if response.status_code != 200:
            print(f"❌ URL invalide (status {response.status_code}): {url}")
            return False
        
        # Vérifier le Content-Type
        content_type = response.headers.get('content-type', '').lower()
        if not any(img_type in content_type for img_type in ['image/', 'jpg', 'jpeg', 'png', 'gif', 'webp']):
            print(f"❌ Pas une image (content-type: {content_type}): {url}")
            return False
        
        print(f"✅ URL valide: {url}")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de requête pour {url}: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue pour {url}: {str(e)}")
        return False

def validate_and_filter_foods(foods_list: List[Dict]) -> List[Dict]:
    """
    Valide les URLs des photos et filtre les aliments avec des URLs valides.
    
    Args:
        foods_list (List[Dict]): Liste des aliments à vérifier
    
    Returns:
        List[Dict]: Liste filtrée des aliments avec des URLs valides
    """
    print("🔍 Début de la vérification des URLs...\n")
    
    valid_foods = []
    invalid_foods = []
    
    for i, food in enumerate(foods_list, 1):
        food_name = food.get('name', 'Inconnu')
        photo_url = food.get('photoUrl', '')
        
        print(f"[{i}/{len(foods_list)}] Vérification de {food_name}...")
        
        if not photo_url:
            print(f"❌ Pas d'URL photo pour {food_name}")
            invalid_foods.append(food)
            continue
        
        if is_valid_image_url(photo_url):
            valid_foods.append(food)
        else:
            invalid_foods.append(food)
        
        # Pause pour éviter de surcharger les serveurs
        time.sleep(0.5)
        print()
    
    return valid_foods, invalid_foods

def save_results(valid_foods: List[Dict], invalid_foods: List[Dict]):
    """
    Sauvegarde les résultats dans des fichiers JSON et affiche un résumé.
    """
    # Sauvegarder la liste filtrée
    with open('valid_healthy_foods.json', 'w', encoding='utf-8') as f:
        json.dump(valid_foods, f, indent=2, ensure_ascii=False)
    
    # Sauvegarder la liste des aliments invalides pour référence
    with open('invalid_foods.json', 'w', encoding='utf-8') as f:
        json.dump(invalid_foods, f, indent=2, ensure_ascii=False)
    
    # Créer aussi une version Python de la liste valide
    with open('valid_healthy_foods.py', 'w', encoding='utf-8') as f:
        f.write("# Liste des aliments sains avec URLs de photos valides\n")
        f.write("# Générée automatiquement par le script de validation\n\n")
        f.write("healthyFoods = ")
        f.write(json.dumps(valid_foods, indent=2, ensure_ascii=False))
    
    print("📊 RÉSUMÉ DE LA VÉRIFICATION")
    print("=" * 50)
    print(f"✅ Aliments avec URLs valides: {len(valid_foods)}")
    print(f"❌ Aliments avec URLs invalides: {len(invalid_foods)}")
    print(f"📈 Taux de réussite: {len(valid_foods)/(len(valid_foods)+len(invalid_foods))*100:.1f}%")
    
    if valid_foods:
        print(f"\n✅ ALIMENTS VALIDÉS:")
        for food in valid_foods:
            print(f"   • {food['name']} ({food['category']})")
    
    if invalid_foods:
        print(f"\n❌ ALIMENTS AVEC URLS INVALIDES:")
        for food in invalid_foods:
            print(f"   • {food['name']} ({food['category']})")
    
    print(f"\n📁 FICHIERS GÉNÉRÉS:")
    print(f"   • valid_healthy_foods.json - Liste JSON des aliments valides")
    print(f"   • valid_healthy_foods.py - Liste Python des aliments valides")
    print(f"   • invalid_foods.json - Liste des aliments avec URLs invalides")

def main():
    """
    Fonction principale du script.
    """
    print("🥗 VÉRIFICATEUR D'URLS DE PHOTOS D'ALIMENTS SAINS")
    print("=" * 60)
    print(f"Nombre total d'aliments à vérifier: {len(healthyFoods)}\n")
    
    try:
        # Valider et filtrer les aliments
        valid_foods, invalid_foods = validate_and_filter_foods(healthyFoods)
        
        # Sauvegarder les résultats
        save_results(valid_foods, invalid_foods)
        
    except KeyboardInterrupt:
        print("\n⚠️ Vérification interrompue par l'utilisateur")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {str(e)}")

if __name__ == "__main__":
    main()
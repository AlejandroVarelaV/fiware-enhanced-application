"""Patch existing Orion entities so their image URLs point to live assets.

Run with:
    python3 backend/fix_images.py
"""

from __future__ import annotations

import os
import sys
from typing import Dict

import requests
from dotenv import load_dotenv


IMAGE_URLS: Dict[str, Dict[str, str]] = {
    'Product': {
        'product-001': 'https://picsum.photos/seed/red-apple-product/640/480',
        'product-002': 'https://picsum.photos/seed/banana-pack-product/640/480',
        'product-003': 'https://picsum.photos/seed/whole-milk-product/640/480',
        'product-004': 'https://picsum.photos/seed/brown-bread-product/640/480',
        'product-005': 'https://picsum.photos/seed/white-rice-product/640/480',
        'product-006': 'https://picsum.photos/seed/olive-oil-product/640/480',
        'product-007': 'https://picsum.photos/seed/coffee-beans-product/640/480',
        'product-008': 'https://picsum.photos/seed/orange-juice-product/640/480',
        'product-009': 'https://picsum.photos/seed/tomato-sauce-product/640/480',
        'product-010': 'https://picsum.photos/seed/pasta-product/640/480',
    },
    'Store': {
        'store-001': 'https://picsum.photos/seed/north-market/640/480',
        'store-002': 'https://picsum.photos/seed/south-market/640/480',
        'store-003': 'https://picsum.photos/seed/east-market/640/480',
        'store-004': 'https://picsum.photos/seed/west-market/640/480',
    },
    'Employee': {
        'employee-001': 'https://i.pravatar.cc/150/1',
        'employee-002': 'https://i.pravatar.cc/150/2',
        'employee-003': 'https://i.pravatar.cc/150/3',
        'employee-004': 'https://i.pravatar.cc/150/4',
    },
}


def verify_remote_image(url: str) -> None:
    response = requests.get(url, timeout=15)
    response.raise_for_status()


def _headers() -> Dict[str, str]:
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Fiware-Service': os.getenv('ORION_FIWARE_SERVICE', 'smart_retail'),
        'Fiware-ServicePath': os.getenv('ORION_FIWARE_SERVICEPATH', '/'),
    }


def list_entities(api_base_url: str, entity_path: str) -> list[dict]:
    response = requests.get(
        f'{api_base_url.rstrip("/")}{entity_path}',
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    if isinstance(data, list):
        return data
    return [data] if data else []


def patch_entity_image(base_url: str, entity_id: str, image_url: str) -> None:
    payload = {'image': {'type': 'Text', 'value': image_url}}
    response = requests.patch(
        f'{base_url.rstrip("/")}/v2/entities/{entity_id}/attrs',
        headers=_headers(),
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    verify_remote_image(image_url)


def main() -> int:
    load_dotenv()
    api_base_url = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
    base_url = os.getenv('ORION_URL', 'http://localhost:1026')
    entity_paths = {
        'Product': '/api/products',
        'Store': '/api/stores',
        'Employee': '/api/employees',
    }

    updated_count = 0
    for entity_type, entity_urls in IMAGE_URLS.items():
        entities = list_entities(api_base_url, entity_paths[entity_type])
        entity_by_id = {entity['id']: entity for entity in entities}

        for entity_id, image_url in entity_urls.items():
            if entity_id not in entity_by_id:
                print(f'Skipping missing {entity_type} entity: {entity_id}', file=sys.stderr)
                continue

            current_image = entity_by_id[entity_id].get('image')
            if current_image == image_url:
                print(f'Already up to date: {entity_type} {entity_id}')
            else:
                patch_entity_image(base_url, entity_id, image_url)
                print(f'Patched {entity_type} {entity_id} -> {image_url}')
                updated_count += 1

    print(f'Finished. Updated {updated_count} entities.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

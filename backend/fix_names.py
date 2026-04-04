"""Patch existing Store and Shelf entities with realistic Manchester-themed data.

Run with:
    python3 backend/fix_names.py

This script does not reseed; it only PATCHes existing entities via backend API.
"""

from __future__ import annotations

import os
import sys
from typing import Dict

import requests
from dotenv import load_dotenv


STORE_PATCHES: Dict[str, Dict[str, object]] = {
    'store-001': {
        'name': 'Old Trafford Market',
        'temperature': 19.5,
        'relativeHumidity': 0.62,
        'countryCode': 'ES',
    },
    'store-002': {
        'name': 'Salford Quays Store',
        'temperature': 22.0,
        'relativeHumidity': 0.71,
        'countryCode': 'ES',
    },
    'store-003': {
        'name': 'Stretford Mall',
        'temperature': 18.0,
        'relativeHumidity': 0.58,
        'countryCode': 'ES',
    },
    'store-004': {
        'name': 'Deansgate Express',
        'temperature': 24.5,
        'relativeHumidity': 0.79,
        'countryCode': 'ES',
    },
}


SHELF_PATCHES: Dict[str, str] = {
    'store-001-shelf-01': 'Fresh Produce A',
    'store-001-shelf-02': 'Dairy & Refrigerated',
    'store-001-shelf-03': 'Bakery & Bread',
    'store-001-shelf-04': 'Beverages',
    'store-002-shelf-01': 'Fresh Produce B',
    'store-002-shelf-02': 'Dairy & Refrigerated',
    'store-002-shelf-03': 'Bakery & Bread',
    'store-002-shelf-04': 'Beverages',
    'store-003-shelf-01': 'Fresh Produce C',
    'store-003-shelf-02': 'Dairy & Refrigerated',
    'store-003-shelf-03': 'Bakery & Bread',
    'store-003-shelf-04': 'Beverages',
    'store-004-shelf-01': 'Fresh Produce D',
    'store-004-shelf-02': 'Dairy & Refrigerated',
    'store-004-shelf-03': 'Bakery & Bread',
    'store-004-shelf-04': 'Beverages',
}


def list_entities(api_base_url: str, entity_path: str) -> list[dict]:
    response = requests.get(f'{api_base_url.rstrip("/")}{entity_path}', timeout=15)
    response.raise_for_status()
    data = response.json()
    if isinstance(data, list):
        return data
    return [data] if data else []


def patch_entity(api_base_url: str, endpoint: str, payload: dict) -> None:
    response = requests.patch(
        f'{api_base_url.rstrip("/")}{endpoint}',
        headers={'Content-Type': 'application/json'},
        json=payload,
        timeout=15,
    )
    response.raise_for_status()


def main() -> int:
    load_dotenv()
    api_base_url = os.getenv('BACKEND_API_URL', 'http://localhost:5000')

    stores = list_entities(api_base_url, '/api/stores')
    shelves = list_entities(api_base_url, '/api/shelves')
    store_by_id = {store['id']: store for store in stores}
    shelf_by_id = {shelf['id']: shelf for shelf in shelves}

    updated_count = 0

    for store_id, payload in STORE_PATCHES.items():
        current = store_by_id.get(store_id)
        if not current:
            print(f'Skipping missing store: {store_id}', file=sys.stderr)
            continue

        if all(current.get(key) == value for key, value in payload.items()):
            print(f'Already up to date: Store {store_id}')
            continue

        patch_entity(api_base_url, f'/api/stores/{store_id}', payload)
        print(f'Patched Store {store_id} -> {payload["name"]}')
        updated_count += 1

    for shelf_id, name in SHELF_PATCHES.items():
        current = shelf_by_id.get(shelf_id)
        if not current:
            print(f'Skipping missing shelf: {shelf_id}', file=sys.stderr)
            continue

        if current.get('name') == name:
            print(f'Already up to date: Shelf {shelf_id}')
            continue

        patch_entity(api_base_url, f'/api/shelves/{shelf_id}', {'name': name})
        print(f'Patched Shelf {shelf_id} -> {name}')
        updated_count += 1

    print(f'Finished. Updated {updated_count} entities.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

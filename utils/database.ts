import * as SQLite from 'expo-sqlite';
import { PlaceDataType } from '../App';

const database = SQLite.openDatabase('place.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx: SQLite.SQLTransaction) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS place (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
            )`,
        [],
        (value: any) => {
          resolve(value);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promise;
}

export function insertPlace(place: PlaceDataType) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO place (title, imageUri, address, lat, lng) VALUES (?,?,?,?,?)`,
        [
          place.title,
          place.image as string,
          place.location.address as string,
          place.location.lat as number,
          place.location.lng as number,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
  return promise;
}

export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM place',
        [],
        (_, result) => {
          const places = [];
          for (const dp of result.rows._array) {
            const placeItem: PlaceDataType = {
              title: dp.title,
              image: dp.imageUri,
              location: {
                lat: dp.lat,
                lng: dp.lng,
                address: dp.address,
              },
              id: dp.id,
            };
            places.push(placeItem);
          }
          resolve(places);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
  return promise;
}

export function fetchPlaceDetails(id: string) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM place WHERE id = ?',
        [id],
        (_, value) => {
          resolve(value.rows._array[0]);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
  return promise;
}

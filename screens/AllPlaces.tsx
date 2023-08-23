import { FC, useEffect, useState } from 'react';
import { PlacesList } from '../components/Places/PlacesList';
import { useIsFocused } from '@react-navigation/native';
import { fetchPlaces } from '../utils/database';

export const AllPlaces: FC = () => {
  const [placesList, setPlacesList] = useState<any>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setPlacesList(places);
    }
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);
  return <PlacesList places={placesList} />;
};

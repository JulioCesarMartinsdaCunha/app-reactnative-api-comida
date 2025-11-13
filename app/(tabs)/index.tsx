// app/(tabs)/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Card,
  Icon,
  Text,
} from 'react-native-paper';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string | null;
  strCategory: string | null;
};

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = React.useState<Meal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'
        );
        const data = await response.json();
        setMeals(data.meals ?? []);
      } catch (e) {
        console.error(e);
        setError('Não foi possível carregar as comidas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator animating size="large" />
        <Text style={{ marginTop: 8 }}>Carregando comidas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Card mode="elevated">
          <Card.Title
            title="Erro"
            left={(props) => <Icon source="alert-circle" {...props} />}
          />
          <Card.Content>
            <Text>{error}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Meal }) => (
    <Card
      style={{ marginBottom: 12 }}
      mode="elevated"
      onPress={() =>
        router.push({
          pathname: '/details',
          params: { idMeal: item.idMeal },
        })
      }
    >
      <Card.Title
        title={item.strMeal}
        subtitle={`${item.strCategory ?? 'Sem categoria'} • ${
          item.strArea ?? 'Origem desconhecida'
        }`}
        left={(props) => <Icon source="food" {...props} />}
      />
      <Card.Cover source={{ uri: item.strMealThumb }} />
    </Card>
  );

  return (
    <View style={styles.screen}>
      <Card mode="outlined" style={{ marginBottom: 8 }}>
        <Card.Title
          title="Comidas (API Pública)"
          left={(props) => (
            <Icon source="silverware-fork-knife" {...props} />
          )}
        />
        <Card.Content>
          <Text>Lista de refeições carregadas da API TheMealDB.</Text>
        </Card.Content>
      </Card>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
    gap: 16,
  },
});

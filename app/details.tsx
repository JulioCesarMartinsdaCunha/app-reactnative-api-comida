// app/details.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Icon, Text } from 'react-native-paper';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string | null;
  strCategory: string | null;
  strInstructions: string | null;
};

export default function DetailsScreen() {
  const { idMeal } = useLocalSearchParams<{ idMeal?: string }>();
  const router = useRouter();
  const [meal, setMeal] = React.useState<Meal | null>(null);
  const [loading, setLoading] = React.useState(!!idMeal);

  React.useEffect(() => {
    if (!idMeal) return;

    const fetchMeal = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        const data = await response.json();
        setMeal(data.meals?.[0] ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [idMeal]);

  if (!idMeal) {
    return (
      <View style={styles.screen}>
        <Card>
          <Card.Title
            title="Nenhuma refeição selecionada"
            left={(props) => <Icon source="alert" {...props} />}
          />
          <Card.Content>
            <Text>Abra a aba Home e toque em uma comida.</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.back()}>Voltar</Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }

  if (loading || !meal) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator animating size="large" />
        <Text style={{ marginTop: 8 }}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card mode="elevated">
          <Card.Title
            title={meal.strMeal}
            subtitle={`${meal.strCategory ?? 'Sem categoria'} • ${
              meal.strArea ?? 'Origem desconhecida'
            }`}
            left={(props) => <Icon source="food" {...props} />}
          />
          {!!meal.strMealThumb && (
            <Image
              source={{ uri: meal.strMealThumb }}
              style={{ width: '100%', height: 220, borderRadius: 12 }}
              resizeMode="cover"
            />
          )}
          <Card.Content style={{ marginTop: 12 }}>
            <Text variant="titleMedium" style={{ marginBottom: 4 }}>
              Instruções:
            </Text>
            <Text>{meal.strInstructions ?? 'Nenhuma instrução encontrada.'}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.back()}>Voltar</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
});

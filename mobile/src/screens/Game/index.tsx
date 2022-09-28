import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useEffect, useState } from "react";
import { Background } from "../../components/Background";
import logoImg from "../../assets/logo-nlw-esports.png";
import { useRoute } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

import { THEME } from "../../theme";
import { styles } from "./styles";
import { GameParams } from "../../@types/navigation";
import { TouchableOpacity, View, Image, FlatList, Text } from "react-native";
import { Header } from "../../components/Header";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState<string>("");

  const route = useRoute();
  const game = route.params as GameParams;
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.0.2:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.0.2:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>
          <Image source={logoImg} style={styles.logo} />
          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Header title={game.title} subtitle="Conecte-se e comece a jogar!" />
        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard onConnect={() => getDiscordUser(item.id)} data={item} />
          )}
          horizontal
          contentContainerStyle={
            duos.length > 0 ? styles.contentList : styles.emptyListContent
          }
          showsHorizontalScrollIndicator={false}
          style={styles.containerList}
          ListEmptyComponent={() => (
            <Text style={styles.emptyList}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />
        <DuoMatch
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected("")}
          visible={discordDuoSelected.length > 0}
        />
      </SafeAreaView>
    </Background>
  );
}

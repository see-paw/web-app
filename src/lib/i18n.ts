import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traduções
const resources = {
    pt: {
        translation: {
            // Espécies
            "Dog": "Cão",
            "Cat": "Gato",
            "Rabbit": "Coelho",
            "Bird": "Pássaro",
            "Other": "Outro",

            // Sexo
            "Male": "Macho",
            "Female": "Fêmea",
            "Unknown": "Desconhecido",

            // Tamanho
            "Small": "Pequeno",
            "Medium": "Médio",
            "Large": "Grande",
            "ExtraLarge": "Extra Grande",

            // Cores comuns (adiciona conforme necessário)
            "Black": "Preto",
            "White": "Branco",
            "Brown": "Castanho",
            "Gray": "Cinzento",
            "Golden": "Dourado",
            "Beige": "Bege",
            "Mixed": "Misto"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt', // língua padrão
        fallbackLng: 'pt',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
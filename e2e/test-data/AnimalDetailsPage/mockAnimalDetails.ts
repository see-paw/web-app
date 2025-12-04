import type { Animal } from "@/types/animal";


//FEMALE ANIMAL WITH MANY IMAGES
export const mockAnimalMaria: Animal = {
        id: "9b3a6c41-2d85-4c7b-9051-fc1e2ab78d44",
        name: "Maria",
        species: "dog",
        sex: "female",
        birthDate: "2022-04-15",
        age: 3,
        colour: "Bege",
        size: "small",
        animalState: "Available",
        cost: 30,
        sterilized: true,
        description: "Esta cadelinha é basicamente uma bolinha de alegria com quatro patas. Super fofa, sempre pronta para brincar, e especialista em transformar dias normais em episódios de comédia romântica — ela faz a comédia, tu tratas da parte romântica com os snacks.\nAdora correr atrás de brinquedos (e ocasionalmente do próprio rabo, porque prioridades), mas também sabe tirar aquelas sestas dignas de um monge Zen. O lema dela é simples: brincar muito, dormir melhor e pedir mimo sempre que possível.",
        features: "Puppy eyes, muito sociável",
        breed: {
            id: "a94b12ec-6f0a-4f8d-9acd-1e72c9fb3349",
            name: "Rafeiro",
            description: "Cão leal, inteligente e protetor."
        },
        images: [
            {
                id: "4f9a2c1b-7e3d-45c8-9f11-5d83e2a4b9cc",
                url : "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763578598/IMG_0594_rifgqj.jpg",
                description : "Maria sendo Maria",
                isPrincipal :true,
                publicId : "IMG_0594_rifgqj"
            },
            {
                id: "c8e27f04-91a6-4dce-a8ab-6a3b0f51d2e9",
                url : "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763578594/IMG_2422_s4mbwt.jpg",
                description : "Maria sendo fofa",
                isPrincipal : false,
                publicId : "IMG_2422_s4mbwt"
            },
            {
                id: "b1f74e6d-0b3a-4f42-ae12-49c7c0f97f55",
                url : "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763578591/IMG_3661_ujgaa1.jpg",
                description : "Maria sendo maravilhosa",
                isPrincipal : false,
                publicId : "IMG_3661_ujgaa1"
            },
            {
                id: "e3d2a9c7-6f01-43f0-8572-0ad3c1e60782",
                url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763578589/IMG_3957_lysorq.jpg",
                description : "Maria sendo fantástica",
                isPrincipal : false,
                publicId : "IMG_3957_lysorq"
            },
            {
                id: "a7c5d3b2-2ac4-4d5b-8f8c-37e9f61e2771",
                url : "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763578587/IMG_4900_x2rqrq.jpg",
                description : "Maria sendo um piglet",
                isPrincipal : false,
                publicId : "IMG_4900_x2rqrq"
            }
        ],
        shelterId: "8f3c2e7b-9c45-4b0b-a21d-6f4b72a1d812",
        currentSupportValue: 0,
    }

export const mockAnimalLeandro: Animal ={
    id: "e4c18f03-7a5d-4bcf-8e8d-2f9a6f3140b1",
    name: "Leandro",
    species: "cat",
    sex: "male",
    birthDate: "2021-11-05",
    age: 4,
    colour: "Castanho claro",
    size: "medium",
    animalState: "PartiallyFostered",
    cost: 50,
    sterilized: true,
    description: "Este gato é o verdadeiro mestre da traquinice — um especialista em planos secretos, acrobacias inesperadas e pequenos delitos felinos como roubar meias, derrubar objetos e fingir que não tem nada a ver com o assunto.",
    features: "Muito obediente e adora correr",
    breed: {
        id: "f2a7c4d1-8b39-4c9d-9e61-73b84c2f5a21",
        name: "Siamês",
        description: "Raça de gato elegante e sociável."
    },
    images: [
        {
            id: "d3a19c7e-4b52-49e2-9f8f-8a62d91c4f33",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763306364/Unknown-2_d9amcf.jpg",
            publicId: "Unknown-2_d9amcf",
            description: "Leandro sendo Leandro",
            isPrincipal: true
        },
        {
            id: "7f2b48e1-9c64-4bfe-bf26-1e5d7390c88b",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763306364/Unknown-3_uiip6e.jpg",
            publicId: "Unknown-3_uiip6e",
            description: "Leandro sendo fofo",
            isPrincipal: false
        },
        {
            id: "acf0e6d2-b31e-4b6c-815e-e0a5d74fae91",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763306365/Unknown-4_ygwdpm.jpg",
            publicId: "Unknown-4_ygwdpm",
            description: "Leandro sendo maravilhoso",
            isPrincipal: false
        }
    ],
    shelterId: "8f3c2e7b-9c45-4b0b-a21d-6f4b72a1d812",
    currentSupportValue: 0,
}


export const mockAnimalJose: Animal = {
    id: "b7f2d6ea-1c34-49ce-96f8-7a12c4e509c7",
    name: "Jose",
    species: "dog",
    sex: "male",
    birthDate: "2025-02-10",
    age: 0,
    colour: "Preto",
    size: "small",
    animalState: "Available",
    cost: 80,
    sterilized: false,
    description: "Este cão tem oficialmente a expressão mais adoravelmente tonta que já existiu. Parece que está sempre meio confuso com a vida — do género “o quê? já é hora de comer outra vez?” — mas a verdade é que isso só o torna ainda mais irresistível.",
    features: "Sabe rebolar",
    breed: {
        id: "0c5e7b92-3df4-4c0b-8f1b-9da31e8a7c44",
        name: "Beagle",
        description: "Cão amigável, curioso e ativo."
    },
    images: [
        {
            id: "5e9d13bc-4f2a-4c0d-9c72-1a8b4c52f067",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763306794/Unknown-5_blrqwy.jpg",
            publicId: "Unknown-5_blrqwy",
            description: "José sendo José",
            isPrincipal: true
        },
        {
            id: "c47f0a21-96c4-4efc-8d25-3b7e92f6c8e4",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763306795/Unknown-6_mstvsn.jpg",
            publicId: "Unknown-6_mstvsn",
            description: "José sendo fofo",
            isPrincipal: false
        }
    ],
    shelterId: "c1e8a540-2f7d-47e4-b8bb-9a6c13f5e2fd",
    currentSupportValue: 0,
}

export const mockAnimalJessica: Animal = {
    id: "3fa91eb5-5edb-4ac3-9ea0-a2c94318e6d0",
    name: "Jéssica",
    species: "cat",
    sex: "female",
    birthDate: "2025-08-22",
    age: 0,
    colour: "Malhada",
    size: "small",
    animalState: "Available",
    cost: 25,
    sterilized: true,
    description: "Esta gata é o equivalente felino a um cobertor quentinho num dia frio. Pequena, elegante e com aquele olhar suave que diz “eu deixo-te fazer festas… mas só porque hoje estou de bom humor.",
    features: null,
    breed: {
        id: "f2a7c4d1-8b39-4c9d-9e61-73b84c2f5a21",
        name: "Siamês",
        description: "Raça de gato elegante e sociável."
    },
    images: [
        {
            id: "8c7f1d2a-3e94-4bb2-94f0-2fa1cc7d4e51",
            url: "https://res.cloudinary.com/dnfgbodgr/image/upload/v1763307014/Unknown-7_jgfbn7.jpg",
            publicId: "Unknown-7_jgfbn7",
            description: "Jéssica sendo Jéssica",
            isPrincipal: true
        }
    ],
    shelterId: "c1e8a540-2f7d-47e4-b8bb-9a6c13f5e2fd",
    currentSupportValue: 0,
}

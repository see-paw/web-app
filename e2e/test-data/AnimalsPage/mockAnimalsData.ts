import type { PagedList } from '@/types/pagedList';
import type { Animal } from '@/types/animal';

/**
 * Mock data for Animals page E2E tests
 * Contains paginated animal data for testing various scenarios
 */

export const mockAnimalsPage1: PagedList<Animal> = {
    items: [
        {
            id: "mock-animal-001",
            name: "Rex Mock",
            species: "Dog",
            size: "Medium",
            sex: "Male",
            breed: {
                id: "breed-001",
                name: "Labrador Retriever",
                description: ""
            },
            animalState: "Available",
            colour: "Brown",
            birthDate: "2020-01-01T00:00:00",
            age: 4,
            description: "Energetic and loyal mock dog.",
            sterilized: true,
            features: "Friendly, active",
            cost: 0,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-002",
            name: "Luna Mock",
            species: "Dog",
            size: "Medium",
            sex: "Female",
            breed: {
                id: "breed-002",
                name: "Golden Retriever",
                description: ""
            },
            animalState: "PartiallyFostered",
            colour: "Golden",
            birthDate: "2021-05-12T00:00:00",
            age: 3,
            description: "Calm and affectionate mock dog.",
            sterilized: true,
            features: "Loves people",
            cost: 25,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-003",
            name: "Max Mock",
            species: "Dog",
            size: "Large",
            sex: "Male",
            breed: {
                id: "breed-003",
                name: "Bulldog",
                description: ""
            },
            animalState: "Available",
            colour: "White",
            birthDate: "2019-09-20T00:00:00",
            age: 5,
            description: "Strong but gentle mock dog.",
            sterilized: false,
            features: "Calm, steady",
            cost: 0,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-004",
            name: "Bella Mock",
            species: "Cat",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-004",
                name: "Siamese",
                description: ""
            },
            animalState: "Available",
            colour: "Cream",
            birthDate: "2021-02-15T00:00:00",
            age: 3,
            description: "Curious and playful mock cat.",
            sterilized: true,
            features: "Very vocal",
            cost: 0,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-005",
            name: "Charlie Mock",
            species: "Cat",
            size: "Small",
            sex: "Male",
            breed: {
                id: "breed-005",
                name: "Maine Coon",
                description: ""
            },
            animalState: "TotallyFostered",
            colour: "Grey",
            birthDate: "2018-10-10T00:00:00",
            age: 6,
            description: "Large and fluffy mock cat.",
            sterilized: false,
            features: "Calm, affectionate",
            cost: 50,
            shelterId: "shelter-mock-03",
            images: []
        },
        {
            id: "mock-animal-006",
            name: "Molly Mock",
            species: "Dog",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-006",
                name: "Beagle",
                description: ""
            },
            animalState: "HasOwner",
            colour: "Tricolor",
            birthDate: "2022-03-01T00:00:00",
            age: 2,
            description: "Smart and highly energetic mock dog.",
            sterilized: true,
            features: "Excellent sense of smell",
            cost: 0,
            shelterId: "shelter-mock-03",
            images: []
        }
    ],
    currentPage: 1,
    pageSize: 6,
    totalPages: 1,
    totalCount: 6
};

export const mockAnimalsPage2: PagedList<Animal> = {
    items: [
        {
            id: "mock-animal-007",
            name: "Thor",
            species: "Dog",
            size: "Large",
            sex: "Male",
            breed: {
                id: "breed-007",
                name: "German Shepherd",
                description: ""
            },
            animalState: "Available",
            colour: "Black and Tan",
            birthDate: "2019-07-15",
            age: 5,
            description: "Protective and loyal.",
            sterilized: true,
            features: "Intelligent, trainable",
            cost: 0,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-008",
            name: "Mia",
            species: "Cat",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-008",
                name: "Persian",
                description: ""
            },
            animalState: "PartiallyFostered",
            colour: "White",
            birthDate: "2020-11-20",
            age: 4,
            description: "Elegant and calm.",
            sterilized: true,
            features: "Long fur, gentle",
            cost: 25,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-009",
            name: "Rocky",
            species: "Dog",
            size: "Medium",
            sex: "Male",
            breed: {
                id: "breed-009",
                name: "Boxer",
                description: ""
            },
            animalState: "TotallyFostered",
            colour: "Brindle",
            birthDate: "2021-03-10",
            age: 3,
            description: "Energetic and playful.",
            sterilized: false,
            features: "Loves to run",
            cost: 50,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-010",
            name: "Luna",
            species: "Cat",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-010",
                name: "British Shorthair",
                description: ""
            },
            animalState: "Available",
            colour: "Gray",
            birthDate: "2022-01-05",
            age: 2,
            description: "Calm and affectionate.",
            sterilized: true,
            features: "Very cuddly",
            cost: 0,
            shelterId: "shelter-mock-03",
            images: []
        },
        {
            id: "mock-animal-011",
            name: "Duke",
            species: "Dog",
            size: "Large",
            sex: "Male",
            breed: {
                id: "breed-011",
                name: "Rottweiler",
                description: ""
            },
            animalState: "HasOwner",
            colour: "Black",
            birthDate: "2018-06-12",
            age: 6,
            description: "Strong and protective.",
            sterilized: true,
            features: "Guard dog",
            cost: 0,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-012",
            name: "Whiskers",
            species: "Cat",
            size: "Small",
            sex: "Male",
            breed: {
                id: "breed-012",
                name: "Ragdoll",
                description: ""
            },
            animalState: "Available",
            colour: "Cream and Brown",
            birthDate: "2021-09-18",
            age: 3,
            description: "Gentle giant.",
            sterilized: false,
            features: "Very relaxed",
            cost: 0,
            shelterId: "shelter-mock-01",
            images: []
        }
    ],
    currentPage: 2,
    pageSize: 6,
    totalPages: 2,
    totalCount: 12
};

export const mockAnimalsData: PagedList<Animal> = {
    items: [
        {
            id: "mock-animal-007",
            name: "Thor",
            species: "Dog",
            size: "Large",
            sex: "Male",
            breed: {
                id: "breed-007",
                name: "German Shepherd",
                description: ""
            },
            animalState: "Available",
            colour: "Black and Tan",
            birthDate: "2019-07-15T00:00:00",
            age: 5,
            description: "Protective and loyal.",
            sterilized: true,
            features: "Intelligent, trainable",
            cost: 0,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-008",
            name: "Mia",
            species: "Cat",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-008",
                name: "Persian",
                description: ""
            },
            animalState: "PartiallyFostered",
            colour: "White",
            birthDate: "2020-11-20T00:00:00",
            age: 4,
            description: "Elegant and calm.",
            sterilized: true,
            features: "Long fur, gentle",
            cost: 25,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-009",
            name: "Rocky",
            species: "Dog",
            size: "Medium",
            sex: "Male",
            breed: {
                id: "breed-009",
                name: "Boxer",
                description: ""
            },
            animalState: "TotallyFostered",
            colour: "Brindle",
            birthDate: "2021-03-10T00:00:00",
            age: 3,
            description: "Energetic and playful.",
            sterilized: false,
            features: "Loves to run",
            cost: 50,
            shelterId: "shelter-mock-01",
            images: []
        },
        {
            id: "mock-animal-010",
            name: "Luna",
            species: "Cat",
            size: "Small",
            sex: "Female",
            breed: {
                id: "breed-010",
                name: "British Shorthair",
                description: ""
            },
            animalState: "Available",
            colour: "Gray",
            birthDate: "2022-01-05T00:00:00",
            age: 2,
            description: "Calm and affectionate.",
            sterilized: true,
            features: "Very cuddly",
            cost: 0,
            shelterId: "shelter-mock-03",
            images: []
        },
        {
            id: "mock-animal-011",
            name: "Duke",
            species: "Dog",
            size: "Large",
            sex: "Male",
            breed: {
                id: "breed-011",
                name: "Rottweiler",
                description: ""
            },
            animalState: "HasOwner",
            colour: "Black",
            birthDate: "2018-06-12T00:00:00",
            age: 6,
            description: "Strong and protective.",
            sterilized: true,
            features: "Guard dog",
            cost: 0,
            shelterId: "shelter-mock-02",
            images: []
        },
        {
            id: "mock-animal-012",
            name: "Whiskers",
            species: "Cat",
            size: "Small",
            sex: "Male",
            breed: {
                id: "breed-012",
                name: "Ragdoll",
                description: ""
            },
            animalState: "Available",
            colour: "Cream and Brown",
            birthDate: "2021-09-18T00:00:00",
            age: 3,
            description: "Gentle giant.",
            sterilized: false,
            features: "Very relaxed",
            cost: 0,
            shelterId: "shelter-mock-01",
            images: []
        }
    ],
    currentPage: 2,
    pageSize: 6,
    totalPages: 2,
    totalCount: 12
};

export const mockAnimalsEmpty: PagedList<Animal> = {
    items: [],
    currentPage: 1,
    pageSize: 6,
    totalPages: 1,
    totalCount: 0
};

/**
 * Helper function to create mock data with specific filters applied
 */
export function createFilteredMockData(
    baseData: PagedList<Animal>,
    filters: {
        species?: string;
        size?: string;
        sex?: string;
    }
): PagedList<Animal> {
    let filteredItems = [...baseData.items];

    if (filters.species) {
        filteredItems = filteredItems.filter(item => item.species === filters.species);
    }

    if (filters.size) {
        filteredItems = filteredItems.filter(item => item.size === filters.size);
    }

    if (filters.sex) {
        filteredItems = filteredItems.filter(item => item.sex === filters.sex);
    }

    return {
        items: filteredItems,
        currentPage: 1,
        pageSize: baseData.pageSize,
        totalPages: Math.ceil(filteredItems.length / baseData.pageSize),
        totalCount: filteredItems.length
    };
}
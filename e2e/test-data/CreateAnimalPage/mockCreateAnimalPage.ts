export const mockBreedsDog = [
    { id: 'breed-1', name: 'Golden Retriever', species: 'Dog' },
    { id: 'breed-2', name: 'Labrador', species: 'Dog' },
    { id: 'breed-3', name: 'Pastor Alemão', species: 'Dog' }
];

export const mockBreedsCat = [
    { id: 'breed-4', name: 'Persa', species: 'Cat' },
    { id: 'breed-5', name: 'Siamês', species: 'Cat' },
    { id: 'breed-6', name: 'Maine Coon', species: 'Cat' }
];

export const mockCreatedAnimalId = '550e8400-e29b-41d4-a716-446655440000';

export const mockCreatedAnimalDetails = {
    id: mockCreatedAnimalId,
    name: 'Luna',
    species: 'Dog',
    breed: {
        id: 'breed-1',
        name: 'Golden Retriever'
    },
    size: 'Large',
    sex: 'Female',
    colour: 'Dourado',
    birthDate: '2022-01-15',
    age: 2,
    sterilized: true,
    cost: 150,
    features: 'Muito brincalhona e adora crianças',
    description: 'Luna é uma cadela muito carinhosa que procura um lar definitivo',
    animalState: 'Available',
    images: [
        {
            id: 'img-1',
            url: 'https://example.com/luna-1.jpg',
            description: 'Luna a brincar no jardim',
            isPrincipal: true
        }
    ],
    shelterId: '11111111-1111-1111-1111-111111111111',
    shelter: {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Abrigo Patinhas Felizes'
    }
};

export const mockUpdatedAnimalsList = {
    items: [
        {
            id: mockCreatedAnimalId,
            name: 'Luna',
            species: 'Dog',
            age: 2,
            breed: { name: 'Golden Retriever' },
            animalState: 'Available',
            images: [
                {
                    url: 'https://example.com/luna-1.jpg',
                    isPrincipal: true
                }
            ]
        }
    ],
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false
};
import { Collaborator } from "@/constants/data";

const collaborators: Collaborator[] = [
  {
    id: "1",
    firstname: "John",
    lastname: "Doe",
    username: "johndoe",
    gender: "male",
    phoneNumber: "0123456789",
    email: "john@example.com",
    applicationStatus: "pending",
    idCardFront: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040696/kedfkszn1jrsfxddvfk2.png",
    idCardBack: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040734/lbn4suqb4twl9j5skcb3.jpg",
    faceImage: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040674/j9tooza1brt4skhockzm.jpg",
    address: "123 Main St, City",
    dateOfBirth: "1990-01-01",
    submissionDate: "2023-05-15",
  },
  {
    id: "2",
    firstname: "Jane",
    lastname: "Smith",
    username: "janesmith",
    gender: "female",
    phoneNumber: "0987654321",
    email: "jane@example.com",
    applicationStatus: "approved",
    idCardFront: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040696/kedfkszn1jrsfxddvfk2.png",
    idCardBack: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040734/lbn4suqb4twl9j5skcb3.jpg",
    faceImage: "https://res.cloudinary.com/dehk1bcny/image/upload/v1742040674/j9tooza1brt4skhockzm.jpg",
    address: "456 Oak St, Town",
    dateOfBirth: "1992-05-15",
    submissionDate: "2023-04-20",
  }
];

export { collaborators };

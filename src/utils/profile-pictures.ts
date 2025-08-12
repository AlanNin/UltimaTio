const MoviesProfileImages = [
  "https://i.pinimg.com/564x/e5/4c/1c/e54c1cabc44ba4765a6c546592bcfb3d.jpg",
  "https://i.pinimg.com/564x/2e/07/91/2e07912e865b810dbef7a21d23412200.jpg",
  "https://i.pinimg.com/564x/44/6b/5e/446b5ea1fe7f74ba30dbe808b85606a7.jpg",
  "https://i.pinimg.com/564x/fa/72/b6/fa72b6742c3dce2ffa55be12feab12d1.jpg",
  "https://i.pinimg.com/564x/2b/a1/e2/2ba1e244631c0f5568a9479d20884792.jpg",
  "https://i.pinimg.com/564x/8a/f6/6f/8af66f6078b057e693eae18aee633210.jpg",
  "https://i.pinimg.com/564x/00/30/8d/00308d733c40fc742a86c31ad4303570.jpg",
  "https://i.pinimg.com/564x/d5/1b/0f/d51b0fbf46344506bfb8c0d2c8434a67.jpg",
];

const TVShowsProfileImages = [
  "https://i.pinimg.com/564x/d5/31/7d/d5317d8b6d2a66c5d20555663ad7e411.jpg",
  "https://i.pinimg.com/564x/58/8e/0e/588e0e6b67116e43fa21064efc58d084.jpg",
  "https://i.pinimg.com/564x/77/04/be/7704be8b2bd6c8eb868d96b4039c3eb6.jpg",
  "https://i.pinimg.com/564x/c2/5a/e4/c25ae4d3f7858e110b39a321aa0ad6bb.jpg",
  "https://i.pinimg.com/564x/82/c7/01/82c7013be0f27b8b25effea94f481ad9.jpg",
];

const AnimeProfileImages = [
  "https://i.pinimg.com/564x/e3/99/3e/e3993e452c225b5809c9304ff9b525e3.jpg",
  "https://i.pinimg.com/736x/81/36/8d/81368dc5ddc862148b55d7bbecdeb363.jpg",
  "https://i.pinimg.com/564x/47/66/fb/4766fbaa4a132ce1d9c2f9b99a7c8dbd.jpg",
];

const CartoonProfileImages = [
  "https://i.pinimg.com/564x/9a/2a/b2/9a2ab298cd3d50454991ec5008ba04ae.jpg",
];

const KShowsProfileImages = [
  "https://i.pinimg.com/564x/57/3b/0e/573b0e504975225f204ceba8b8d2e58b.jpg",
];

const AllProfileImages = [
  ...MoviesProfileImages,
  ...TVShowsProfileImages,
  ...AnimeProfileImages,
  ...CartoonProfileImages,
  ...KShowsProfileImages,
];

export const getRandomProfilePicture = () => {
  const randomIndex = Math.floor(Math.random() * AllProfileImages.length);
  return AllProfileImages[randomIndex];
};

export const getAllProfilePictures = () => {
  return {
    MoviesProfileImages,
    TVShowsProfileImages,
    AnimeProfileImages,
    CartoonProfileImages,
    KShowsProfileImages,
    AllProfileImages,
  };
};

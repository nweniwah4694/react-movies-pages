import noAvatar from '../images/no_avatar.jpg';
import noImage from '../images/no_image.png';

const defaultImg = (type) => {
  switch (type) {
    case 'avatar':
      return noAvatar;
    case 'poster':
    default:
      return noImage;
  }
};

export const imgSrc = (imgPath = '', width = 0, type = 'poster') => {
  if (!imgPath) return defaultImg(type);

  const w = width === 0 ? '' : `/w${width}`;
  return `https://image.tmdb.org/t/p${w}${imgPath}`;
};

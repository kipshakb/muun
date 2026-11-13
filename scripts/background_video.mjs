// Видео из шаблона Framer в блоке «Video» (раздел «О форуме»).
// Сам блок на сайте скрыт стилями (display:none), но сборка раньше ставила
// видео autoplay + preload="auto", и браузер при каждом открытии страницы
// начинал качать 4K-файл на 13,4 МБ, отнимая канал у картинок.
// Теперь видео не грузится заранее, а если блок когда-нибудь включат —
// подтянется лёгкая версия 960×540 (1,7 МБ) вместо 4K.
export const PEXELS_VIDEO_UHD =
  'https://videos.pexels.com/video-files/8244207/8244207-uhd_2560_1440_25fps.mp4';
export const PEXELS_VIDEO_LIGHT =
  'https://videos.pexels.com/video-files/8244207/8244207-sd_960_540_25fps.mp4';

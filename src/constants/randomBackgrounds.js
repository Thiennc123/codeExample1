import bgImage from '@iso/assets/images/background/signin.png';
import bgImage1 from '@iso/assets/images/background/signin1.png';
import bgImage2 from '@iso/assets/images/background/signin2.png';
import bgImage3 from '@iso/assets/images/background/signin3.png';
import bgImage4 from '@iso/assets/images/background/signin4.png';

export const handleShowRandomImage = () => {
    var backgroundImage = [bgImage, bgImage1, bgImage2, bgImage3, bgImage4];
    var item = backgroundImage[Math.floor(Math.random() * backgroundImage.length)];
    return item;
}
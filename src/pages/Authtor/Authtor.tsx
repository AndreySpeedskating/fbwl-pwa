import { IonContent, IonImg, IonPage } from '@ionic/react';

import about from '../../assets/image/about1.webp';
import about2 from '../../assets/image/about2.webp';
import heart from '../../assets/image/heart.png';
import stars from '../../assets/image/stars.png';
import NavHeader from '../../components/NavHeader';
import { useServiceHook } from '../../utils/hooks';
import styles from './styles.module.css';

const DEFAULT_TEXT_CLASS = 'text-color';
const DESCRIPTION_CLASS = `${styles['description']} ${styles[DEFAULT_TEXT_CLASS]}`;

const Authtor = (): JSX.Element => {
  const { history } = useServiceHook();
  return (
    <IonPage>
      <NavHeader white onBackClick={() => history.goBack()} title="O forbarbie_withlove" />
      <IonContent className={styles['authtor-page']}>
        <div style={{ padding: '36px 20px', gap: '16px' }} className="flex-column">
          <span className={`${styles['title']} ${styles[DEFAULT_TEXT_CLASS]}`}>
            Всем привет! Я - Корсакова Дарья
          </span>
          <span className={DESCRIPTION_CLASS}>
            Бывший экономист, действующий фотограф, счастливая мама двоих детей!
          </span>
          <IonImg src={about} />
          <span className={DESCRIPTION_CLASS}>
            Пройдя все прелести декретного быта, пытаясь совмещать работу, детей, дом, в один из
            обычных хмурых питерских дней я купила дочке Барби. С этого незначительного события и
            началось моё увлечение куклами.
          </span>
          <span
            style={{ fontWeight: 600, lineHeight: '28px', marginTop: '12px' }}
            className={DESCRIPTION_CLASS}
          >
            Сейчас, спустя три года, кукла стали неотъемлемой частью моей жизни.
          </span>
          <span className={DESCRIPTION_CLASS}>
            Знание основ фотографии помогло мне, возможность передать красоту куклы, отобразить её
            реалистично - вот что захватило меня прежде всего; а любовь к фоторепортажу подтолкнула
            меня к идее создавать короткие жизненные зарисовки, фотоистории! Так появились Пит и
            Нелли, а затем и их друзья со своими кукольными биографиями.
          </span>
          <IonImg src={about2} />
          <span className={DESCRIPTION_CLASS}>
            Съёмки нуждались в декорациях. Так моё хобби пополнилось ещё одним направлением-
            строительство диорам в формате 1/6.
            <br />
            <br />
            Расширялся круг моих знакомств и интересов, и вот в моих руках подборка литературы о
            сценарном мастерстве, для кукол организована отдельная мастерская, программист пишет
            приложение, предоставляющее собой неоконченную книгу..
          </span>
          <div style={{ marginTop: 12 }} className={styles['ps']}>
            <IonImg className={styles['heart']} src={heart} />
            <span style={{ fontWeight: 600, lineHeight: '22px' }} className={DESCRIPTION_CLASS}>
              Кажется, мои маленькие человечки захватили меня навсегда!!
            </span>
            <IonImg className={styles['stars']} src={stars} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Authtor;

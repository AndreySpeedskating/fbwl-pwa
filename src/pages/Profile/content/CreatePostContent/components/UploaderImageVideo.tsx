import { imageOutline } from 'ionicons/icons';
import { ChangeEvent, FC } from 'react';

import { IonIcon } from '@ionic/react';

type PropTypes = {
  getVideoImage: (event: ChangeEvent<HTMLInputElement>, name?: string) => void;
  name?: string;
  url?: string;
}

const UploaderImageVideo: FC<PropTypes> = ({ getVideoImage, name, url }) => (
  <span>
    <input type="file" accept="image/*" style={{ display: 'none' }} id={name}
           onChange={(e) => getVideoImage(e, name)}/>
      <label htmlFor={name}>
        { url ? (<img style={{ width: '60px' }} src={ url }/>) : (<IonIcon
          icon={imageOutline}
          style={{ margin: 'auto 0px auto auto' }}>

        </IonIcon>) }
      </label>
  </span>
)
 export default UploaderImageVideo

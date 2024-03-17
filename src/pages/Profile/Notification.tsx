import { Page } from '../../components/UI';
import { NotificationContent } from './content';

const Notification = (): JSX.Element => (
  <Page key="notifications" href="#/profile" title="Уведомления">
    <NotificationContent />
  </Page>
);

export default Notification;

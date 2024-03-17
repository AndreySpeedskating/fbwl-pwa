import { Page } from '../../components/UI';
import { useServiceHook } from '../../utils/hooks';
import CreatePostContent from './content/CreatePostContent/CreatePostContent';

const CreatePost = (): JSX.Element => {
  const { history } = useServiceHook();
  return (
    <Page
      key="create"
      onNavClick={() => {
        history.goBack();
      }}
      title="Создание поста"
    >
      <CreatePostContent />
    </Page>
  );
};

export default CreatePost;

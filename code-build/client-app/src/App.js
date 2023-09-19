import FileUpload from './components/FileUpload';
import { Provider } from 'react-redux';
import store from './redux/store';
import Filters from './components/Filters';
import UserActivity from './components/UserActivity';

function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <Filters></Filters>
        <div className='row'>
          <FileUpload></FileUpload>
          <UserActivity></UserActivity>
        </div>
      </div>
    </Provider>

  );
}
export default App;
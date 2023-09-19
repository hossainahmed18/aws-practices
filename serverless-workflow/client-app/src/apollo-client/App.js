import FileUpload from './components/FileUpload';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Filters from '../components/Filters';
import UserActivity from './components/UserActivity';
import ApolloWrapper from './ApolloWrapper'



function App() {
  return (
    <Provider store={store}>
      <ApolloWrapper>
        <div className="container">
          <Filters></Filters>
          <div className='row'>
            <FileUpload></FileUpload>
            <UserActivity></UserActivity>
          </div>
        </div>
      </ApolloWrapper>
    </Provider>
  );
}
export default App;
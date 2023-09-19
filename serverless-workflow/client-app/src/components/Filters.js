import customers from '../data/Customers';
import { connect, useSelector, useDispatch } from 'react-redux';
import { changeFilterOptions } from '../redux/UserActivityAction';

const Filters = () => {
    const filerOptions = useSelector((state) => state.filerOptions);
    const dispatch = useDispatch();

    const filterChanged = (filterType, changedData) => {
        const currentFilterOptions = { ...filerOptions };
        if (filterType === "selectedCustomer") {
            currentFilterOptions.selectedCustomer = changedData;
            currentFilterOptions.selectedUser = "";
        } else {
            currentFilterOptions[filterType] = changedData;
        }
        dispatch(changeFilterOptions(currentFilterOptions));
    }

    return (
        <div className='row'>
            <div className='col-2'>
                <h5 className='mt-5'>Customer</h5>
                <select value={filerOptions.selectedCustomer.Name ?? ""} className="form-select" aria-label="Default select example" onChange={(event) => filterChanged("selectedCustomer", customers.find(a => a.Name === event.target.value))}>
                    <option key="" value="">Open this select menu</option>
                    {
                        customers.map((customer) => {
                            return <option key={customer.Name} value={customer.Name}>{customer.Name}</option>
                        })
                    }
                </select>
            </div>
            <div className='col-4'>
                <h5 className='mt-5'>User</h5>
                <select value={filerOptions.selectedUser ?? ""} className="form-select" aria-label=" select example" onChange={(event) => filterChanged("selectedUser", event.target.value)}>
                    <option key="" value="">Open this select menu</option>
                    {
                        filerOptions.selectedCustomer.Users?.map((user) => {
                            return <option key={user} value={user}>{user}</option>
                        })
                    }
                </select>
            </div>
            <div className='col-6'>
                <div className='row float-end me-5'>
                    <div className='col-6'>
                        <h5 className='mt-5'>From Date</h5>
                        <input type="datetime-local" value={filerOptions.startDate} onChange={(event) => filterChanged("startDate", event.target.value)}></input>
                    </div>
                    <div className='col-6'>
                        <h5 className='mt-5'>To Date</h5>
                        <input type="datetime-local" value={filerOptions.endDate} onChange={(event) => filterChanged("endDate", event.target.value)}></input>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        filerOptions: state.filerOptions
    }
}
const mapDispatchToProps = () => {
    return {
        changeFilterOptions: (updatedfilerOptions) => changeFilterOptions(updatedfilerOptions)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Filters);
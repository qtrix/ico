import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css'
function DropDownButton() {
  return (
    <Dropdown>
    <Dropdown.Toggle id="dropdown-button-dark-example1" drop="down-centered"   variant="secondary">
      Filters
    </Dropdown.Toggle>

    <Dropdown.Menu variant="dark">
      <Dropdown.Item href="#/action-2">Address</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item href="#/action-3">Block Number</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item href="#/action-4">Transaction Hash</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  );
}

export default DropDownButton;
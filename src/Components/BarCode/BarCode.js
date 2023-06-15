import Barcode from "react-barcode";

const BarCode = (props) => {
    return (
        <Barcode value={props.value} />
    );
}

export default BarCode;
    
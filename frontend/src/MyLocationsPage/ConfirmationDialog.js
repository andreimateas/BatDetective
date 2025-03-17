const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const dialogStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
};

const buttonStyle = {
    padding: '10px',
};

const ConfirmationDialog = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <h3>Șterge locație</h3>
                <p>Ești sigur că vrei să ștergi această locație? Acțiunea este ireversibilă <br></br> și vei pierde accesul la locație.</p>
                <button id="closeDialogButton" onClick={onClose} style={buttonStyle}>Anulează</button>
                <button id="confirmDialogButton" onClick={onConfirm} style={buttonStyle}><span style={{color:"white"}}>Șterge</span></button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
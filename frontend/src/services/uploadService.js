import { toast } from "react-toastify";
import axios from "axios";

export const uploadImage = async event => {
    let toastId = null;

    const image = await getImage(event);
    if(!image) return null;

    const formData = new FormData();
    formData.append('image', image, image.name)
    const response = await axios.post('api/upload', formData, {
        onUploadProgress: ({progress}) => {
            if(toastId) toast.update(toastId, {progress});
            else toastId = toast.success('Laddar upp...', {progress})
        }
    })
    toast.dismiss(toastId);
    return response.data.imageUrl;
}

const getImage = async event => {
    const files = event.target.files;
    if(!files || files.length <= 0) {
        toast.warning('Uppladdad fil är inte markerad', 'Ladda upp fil');
        return null;
    }

    const file = files[0];

    if(file.type !== 'image/jpeg') {
        toast.error('Endast JPG Filer Tillåtna', 'Filtyp Fel')
        return null;
    }

    return file;
}
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnectors';
import { catalogData } from '../apis';

export const getCatalogPageData = async(categoryId) => {

    const toastId = toast.loading("Loading...");
    let result = [];
    try{

        console.log("PRINTING CATEGORY ID>>>>>>>>: ", categoryId);

        // const config = {
        //             categoryId: categoryId, // Ensure categoryId is here
        //     };
        // console.log("Request Configuration:", config);

        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, 
            {categoryId: categoryId}
            // config
        );
        console.log("22222222222222")

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

        result = response?.data;
        console.log("44444444444444")

    }
    catch(error) {
        console.log("CATALOG PAGE DATA API ERROR....", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}


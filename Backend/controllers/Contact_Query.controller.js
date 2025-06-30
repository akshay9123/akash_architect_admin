import ContactQuery from "../models/contact.model.js"


// THIS IS THE CREATION OF THE CONTACT QUERY 
export const createContactQuery = async(req, res) =>{
    try {
        const {name,email,phone,message} = req.body 

        if(!name || !email || !phone){
            return res.status(404).json({
                msg:"Each field is compulsory"
            })
        }

        const query = new ContactQuery({
            name,
            email,
            phone,
            message
        })

        await query.save()

        res.status(200).json({
            name,
            email,
            phone,
            message,
            msg: "All the data are saved into the DB"
        })
    } catch (error) {
        res.status(405).json({
            msg: "There is some error while creating the contact Query",
            error
        })
    }
}



// THIS IS THE FETCHING THE CONTACT QUERY FROM THE DATABASE
export const getContact = async(req, res) =>{
    try {
        const querys = await ContactQuery.find()

        res.status(200).json({
            querys
        })
    } catch (error) {
        return res.status(404).json({
            message: "There is some error while getting the query"
        })
    }
}

// THIS IS FOR THE UPDATE THE STATUS OF THE QUERY
export const updateQuery = async(req, res) =>{
    try {
        const {id} = req.params
        const {status} = req.body

        if (!status) {
            return res.status(400).json({ msg: "Status is required" });
        }

        const query = await ContactQuery.findByIdAndUpdate(id,{status}, {new: true})

         if (!query) {
            return res.status(404).json({ msg: "Contact query not found" });
        }

        res.status(200).json({
            msg: "Status updated successfully",
            query,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error while updating contact status",
            error: error.message,
        });
    }
}

// THIS IS FOR THE DELETE THE QUERY
export const deleteQuery = async(req, res) =>{
    try {
        const {id} = req.params

        const deletedQuery = await ContactQuery.findByIdAndDelete(id)

        if(!deletedQuery){
            return res.status(404).json({
                msg: "Contact Query is not found"
            })
        }

        res.status(200).json({
            msg: "Contact Query is deleted Successfully",
            deletedQuery
        })
    } catch (error) {
            res.status(500).json({
            msg: "There was an error while deleting the contact query",
            error: error.message,
        });
    }
}
function createCRUDController (Model,options ={}){
   const {
    select = "",
    populate = "",
    sort = "-createdAt",
    allowedFilters =[],
    searchFields = []
   }= options

   return{
        // CREATE kekw
        create : async (req,res)=>{
            try{
                const newUser = new Model(req.body);
                newUser.save();
                res.status(201).json({sucess : true});

            }catch(err){
                res.status(400).json({
                    success : false,
                    error : err.message,
                });
            }
        },
        getAll : async (req, res)=>{
            try{
                const {
                    page = 1 ,
                    limit  = 10,
                    search,
                    sort : querySort = "-createdAt",
                    ...filters
                }= req.query
                
                console.log(typeof(querySort));
                let query =  Model.find();

                // applying the search 
                if (search && searchFields.length > 0 ){
                    query= query.or(
                        searchFields.map(field => ({
                            [field] : {$regex : search , $options : "i"}
                        }))
                    )
                }

                // applying the filters 
                allowedFilters.forEach(filter => {
                    if (filters[filter] !== undefined){
                        query = query.where(`${filter}`,filters[filter]);
                    }
                });

                // sorting and limmiting
                query = query.sort(querySort);

                //apllying pagination
                const skip = (page-1)*limit;
                query = query.skip(skip).limit(limit);

                const documents = await query;

                res.status(200).json({
                    success : true,
                    Data : documents
                });
                
            }catch(err){
                console.log(err.message)
                res.status(500).json({
                    success : false,
                    message : err.message
                })
            }
        },
        getById :async (req, res)=>{
            try{
                const id = req.params.id;
                console.log(id);
                let query = Model.findById(id);
                // handeling the populate and sort
                if(sort)  query = query.select(select);
                if(populate) query = query.populate(populate);

                const documents = await query ;
                res.status(200).json({
                    success : true,
                    data : documents
                })
            }catch(err){
                res.status(500).json({
                    success : false,
                    message : err.message
                })
            }
        },
        delete : async (req,res)=>{
            try{
                await Model.findOneAndDelete({_id : req.params.id});
                res.status(200).json({
                    success : true
                })
            }catch(err){
                res.status(500).json({
                    success : false,
                    message : err.message
                })
            }
        }
   }
}

module.exports = createCRUDController;
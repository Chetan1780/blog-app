import {handleError} from '../Helper/handleError.js'
import Likes from '../models/LikeModel.js';
export const like = async (req, res, next) => {
    try {
      const { userid, blogid } = req.body;
      let like;
  
      // Check if the like exists
      like = await Likes.findOne({ userid, blogid });
  
      if (!like) {
        const saveLike = new Likes({
          userid,
          blogid
        });
        like = await saveLike.save();
      } else {
        await Likes.findByIdAndDelete(like._id);
      }
  
      // Get the updated like count (and only send simple data)
      const countLike = await Likes.countDocuments({ blogid });
  
      // Return only the necessary data in the response
      res.status(200).json({
        success: true,
        countLike
      });
  
    } catch (error) {
      next(handleError(500, error.message)); // Handle error if needed
    }
  };
  
export const likeCount = async (req,res,next)=>{
    try {
        const {blogid,userid} = req.params;
        const countLike = await Likes.countDocuments({blogid});
        let isLikedByUser=false;
        if(userid){
            const getUserLike = await Likes.countDocuments({blogid,userid})
            console.log(getUserLike)
            if(getUserLike>0) isLikedByUser = true;
        }
        res.status(200).json({
            countLike,
            isLikedByUser
        })
        
    } catch (error) {
        next(handleError(500,error.message));
    }

}
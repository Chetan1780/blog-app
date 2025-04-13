import {handleError} from '../Helper/handleError.js'
import Likes from '../models/LikeModel.js';
export const like = async (req, res, next) => {
    try {
      const { userid, blogid } = req.body;
      let like;
  
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
  
      const countLike = await Likes.countDocuments({ blogid });
  
      res.status(200).json({
        success: true,
        countLike
      });
  
    } catch (error) {
      next(handleError(500, error.message));
    }
  };
  
export const likeCount = async (req,res,next)=>{
    try {
        const {blogid,userid} = req.params;
        const countLike = await Likes.countDocuments({blogid});
        let isLikedByUser=false;
        if(userid){
            const getUserLike = await Likes.countDocuments({blogid,userid})
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
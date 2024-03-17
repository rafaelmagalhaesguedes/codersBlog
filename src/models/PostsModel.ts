//
import PostsCategoriesModel from './PostsCategoriesModel';
import SequelizeUser from '../database/models/SequelizeUser';
import { IPostsModel } from '../interfaces/Posts/IPostsModel';
import SequelizePosts from '../database/models/SequelizePosts';
import { IPosts, IPostsCreate } from '../interfaces/Posts/IPosts';
import SequelizeCategories from '../database/models/SequelizeCategories';

class PostsModel implements IPostsModel {
  //
  constructor(
    private postsModel = SequelizePosts,
    private postsCategoriesModel = new PostsCategoriesModel(),
  ) { }

  public async create(post: IPostsCreate, userId: number): Promise<IPosts | null> {
    //
    const newPost = await this.postsModel.create({
      ...post, userId, published: new Date(), updated: new Date(),
    });

    if (!newPost) return null;

    const newPostCategories = await this.postsCategoriesModel.create(
      newPost.id, post.categoryIds,
    );

    if (!newPostCategories) return null;

    return newPost;
  }

  public async findAll(): Promise<IPosts[] | null> {
    //
    const posts = await this.postsModel.findAll({
      include: [
        { 
          model: SequelizeUser, as: 'user', attributes: { exclude: ['password', 'role'] },
        },
        {
          model: SequelizeCategories, as: 'categories', through: { attributes: [] },
        },
      ],
    });

    if (!posts) return null;

    return posts;
  }

  public async findById(id: number): Promise<IPosts | null> {
    //
    const post = await this.postsModel.findByPk(id, {
      include: [
        { 
          model: SequelizeUser, as: 'user', attributes: { exclude: ['password', 'role'] },
        },
        {
          model: SequelizeCategories, as: 'categories', through: { attributes: [] },
        },
      ],
    });

    if (!post) return null;

    return post;
  }
}

export default PostsModel;
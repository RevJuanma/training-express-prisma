import { SignupInputDTO } from '@domains/auth/dto';
import { PrismaClient } from '@prisma/client';
import { OffsetPagination } from '@types';
import { ExtendedUserDTO, UserDTO } from '../dto';
import { UserRepository } from './user.repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) { }

  async create(data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data,
    }).then(user => new UserDTO(user));
  }

  async getById(userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user ? new UserDTO(user) : null;
  }

  async delete(userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async getRecommendedUsersPaginated(options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      // take: options.limit,
      // skip: options.skip,
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
    return users.map(user => new UserDTO(user));
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    return user ? new ExtendedUserDTO(user) : null;
  }

  async patchPrivate(userId: string): Promise<UserDTO> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        private: user?.private ? !user.private : true,
      },
    })
    return updatedUser
  }
  async patchProfileImage(userId: string, url: string): Promise<UserDTO> {
    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: url
      },
    })
    return updatedUser
  }

  // async patchProfileImage(userId: string): Promise<UserDTO> {
  //   const user = await this.db.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   })

  //   if (!user) {
  //     throw new NotFoundException();
  //   }

  //   const params = {
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: `profile-images/${user.id}.jpg`,
  //     Expires: 3600 // tiempo en segundos para que el pre-signed URL expire
  //   };

  //   const url = await s3.getSignedUrlPromise('putObject', params);

  //   // const updatedUser = await this.db.user.update({
  //   //   where: {
  //   //     id: userId
  //   //   },
  //   //   data: {
  //   //     profileImage: url
  //   //   }
  //   // });

  //   return user
  // }
}

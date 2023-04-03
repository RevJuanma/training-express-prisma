export class FollowDTO {

  constructor(follow: FollowDTO) {
    this.id = follow.id;
    this.followerId = follow.followerId;
    this.followedId = follow.followedId;
  }

  id: string;
  followerId: string;
  followedId: string;
}

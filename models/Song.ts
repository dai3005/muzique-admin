export type Song = {
  songId: number;
  coverImageUrl: string;
  name: string;
  nameSearch: string;
  audioUrl: string;
  description: string;
  albumId: number;
  createdAt: string;
  updatedAt: string;
};

export type SongDetail = {
  song: Song;
  listArtistId: number[];
  listGenreId: number[];
  listPlaylistId: number[];
};

import { Rotate90DegreesCcw, UploadFile } from '@mui/icons-material';
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Stack,
  OutlinedInput,
  Divider,
  useStepContext
} from '@mui/material';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile, removeVietnameseTones } from '@muzique/helper/helper';
import { Album } from '@muzique/models/Album';
import { Artist } from '@muzique/models/Artist';
import { Genre } from '@muzique/models/Genre';
import { Playlist } from '@muzique/models/Playlist';
import { Song, SongDetail } from '@muzique/models/Song';
import { promises } from 'dns';
import _, { forEach } from 'lodash';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Swal from 'sweetalert2';

type Props = {
  song?: SongDetail;
  open: boolean;
  handleClose: () => void;
  reloadPage: () => void;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

type Option = {
  value: number;
  label: string;
};

const SongModal: FC<Props> = ({ song, open, handleClose, reloadPage }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [listArtists, setListArtists] = useState<number[]>();
  const [listGenre, setListGenre] = useState<number[]>();
  const [listPlaylist, setListPlaylist] = useState<number[]>();
  const [albumId, setAlbumId] = useState<number>();

  const [songImage, setSongImage] = useState<string>();
  const [songImgFile, setSongImgFile] = useState<File>();
  const [songAudio, setSongAudio] = useState<string>();
  const [songAudioFile, setSongAudioFile] = useState<File>();
  const [songName, setSongName] = useState<string>();
  const [songDes, setSongDes] = useState<string>();
  const [songLyric, setSongLyric] = useState<string>();

  const urls = [
    { url: '/getListArtist', setState: setArtists },
    { url: '/getListAlbum', setState: setAlbums },
    { url: '/getListGenre', setState: setGenres },
    { url: '/getListPlaylist', setState: setPlaylists }
  ];

  useEffect(() => {
    Promise.all([
      ...urls.map((e) =>
        apiCall({
          url: e.url,
          method: 'get',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            page: 1,
            rowperpage: 0
          }
        })
      )
    ]).then((response) => {
      response.forEach((res, index) => {
        urls[index].setState(res.data.listData);
      });
    });
  }, []);

  const albumOptions = albums.map((a) => {
    return { value: a.albumId, label: a.name };
  });
  const artistOptions = artists.map((a) => {
    return { value: a.artistId, label: a.name };
  });

  const genreOptions = genres.map((g) => {
    return { value: g.genreId, label: g.name };
  });

  const playlistOptions = playlists.map((p) => {
    return { value: p.playlistId, label: p.name };
  });

  useEffect(() => {
    if (song) {
      setListArtists(song.listArtistId);
      setListGenre(song.listGenreId);
      setListPlaylist(song.listPlaylistId);
      setAlbumId(song.song.albumId);
      setSongImage(getFile(song.song.coverImageUrl));
      setSongAudio(getFile(song.song.audioUrl));
      setSongName(song.song.name);
      setSongDes(song.song.description);
      setSongLyric(song.song.lyric);
    }
  }, [song]);

  const autoComplete: {
    label: string;
    placeholder: string;
    multiple: boolean;
    id: string;
    options: Option[];
    value: Option | Option[] | null;
    onChange: (value: Option | Option[] | null) => void;
  }[] = [
    {
      label: 'Album',
      placeholder: 'Chọn Album',
      multiple: false,
      id: 'album',
      options: albumOptions,
      value: albumId
        ? {
            label: albumOptions.find((a) => a.value === albumId)?.label ?? '',
            value: albumId
          }
        : null,
      onChange: (v) => setAlbumId((v as Option).value)
    },
    {
      label: 'Thể loại',
      placeholder: 'Chọn Thể loại',
      multiple: true,
      options: genreOptions,
      id: 'genre',
      value:
        listGenre?.map((l) => {
          return {
            label: genreOptions.find((a) => a.value === l)?.label ?? '',
            value: l
          };
        }) ?? [],
      onChange: (v) => {
        setListGenre((v as Option[]).map((value) => value.value));
      }
    },
    {
      label: 'Ca sĩ',
      placeholder: 'Chọn Ca sĩ',
      multiple: true,
      options: artistOptions,
      id: 'artist',
      value:
        listArtists?.map((l) => {
          return {
            label: artistOptions.find((a) => a.value === l)?.label ?? '',
            value: l
          };
        }) ?? [],
      onChange: (v) => {
        setListArtists((v as Option[]).map((value) => value.value));
      }
    },
    {
      label: 'Playlist',
      placeholder: 'Chọn Playlist',
      multiple: true,
      options: playlistOptions,
      id: 'playlist',
      value:
        listPlaylist?.map((l) => {
          return {
            label: playlistOptions.find((a) => a.value === l)?.label ?? '',
            value: l
          };
        }) ?? [],
      onChange: (v) => {
        setListPlaylist((v as Option[]).map((value) => value.value));
      }
    }
  ];

  const createSong = (fileImg: string, fileSong: string) => {
    apiCall({
      url: '/createSong',
      method: 'post',
      headers: HEADER.HEADER_DEFAULT,
      data: {
        songId: 0,
        name: songName,
        nameSearch: removeVietnameseTones(songName ?? ''),
        audioUrl: fileSong,
        description: songDes,
        coverImageUrl: fileImg,
        lyric: songLyric,
        albumId: albumId,
        listArtist: listArtists,
        listGenre: listGenre,
        listPlaylist: listPlaylist
      }
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Bạn đã tạo bài hát này thành công!',
          preConfirm: function () {
            handleClose();
            reloadPage();
          }
        });
      }
    });
  };

  const updateSong = (fileImg: string, fileSong: string) => {
    const oldA: number[] = _.difference(song?.listArtistId, listArtists ?? []);
    const newA: number[] = _.difference(listArtists, song?.listArtistId ?? []);
    const oldG: number[] = _.difference(song?.listGenreId, listGenre ?? []);
    const newG: number[] = _.difference(listGenre, song?.listGenreId ?? []);
    const oldP: number[] = _.difference(
      song?.listPlaylistId,
      listPlaylist ?? []
    );
    const newP: number[] = _.difference(
      listPlaylist,
      song?.listPlaylistId ?? []
    );

    apiCall({
      url: '/updateSong',
      method: 'put',
      headers: HEADER.HEADER_DEFAULT,
      data: {
        songId: song?.song.songId,
        name: songName,
        nameSearch: removeVietnameseTones(songName ?? ''),
        audioUrl: fileSong,
        description: songDes,
        coverImageUrl: fileImg,
        lyric: songLyric,
        albumId: albumId,
        listArtist: newA,
        listArtistDelete: oldA,
        listGenre: newG,
        listGenreDelete: oldG,
        listPlaylist: newP,
        listPlaylistDelete: oldP
      }
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Bạn đã sửa bài hát này thành công!',
          preConfirm: function () {
            handleClose();
            reloadPage();
          }
        });
      }
    });
  };

  const uploadFile = () => {
    apiCall({
      url: '/uploadFile',
      method: 'post',
      headers: HEADER.multipartHeader,
      data: {
        fileImage: songImgFile,
        fileSong: songAudioFile
      }
    }).then((response) => {
      if (response.status === 200) {
        if (song) {
          updateSong(response.data.filePathImage, response.data.filePathSong);
        } else
          createSong(response.data.filePathImage, response.data.filePathSong);
      }
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ zIndex: 1000 }}
      >
        <Stack sx={style}>
          <Stack
            component={'form'}
            spacing={2}
            maxHeight={'800px'}
            overflow={'auto'}
            padding={'10px'}
          >
            <TextField
              id="name"
              label="Tên bài hát"
              variant="outlined"
              value={songName ?? ''}
              onChange={(e) => setSongName(e.target.value)}
            />
            <Typography>Ảnh</Typography>
            <Stack
              direction={'row'}
              spacing={2}
              sx={{ marginTop: '5px !important' }}
            >
              <TextField
                id="imgFile"
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSongImgFile(e.target.files?.[0]);

                  let file = e.target.files?.[0];
                  let reader = new FileReader();
                  reader.onloadend = (event) => {
                    setSongImage(event.target?.result?.toString());
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <img
                width={100}
                height={100}
                style={{ borderRadius: '3px', objectFit: 'contain' }}
                src={songImage}
                alt="img"
              />
            </Stack>
            <Typography>Audio</Typography>
            <Stack
              direction={'row'}
              spacing={2}
              sx={{ marginTop: '5px !important' }}
            >
              <TextField
                id="audioFile"
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSongAudioFile(e.target.files?.[0]);

                  let file = e.target.files?.[0];
                  let reader = new FileReader();
                  reader.onloadend = (event) => {
                    setSongAudio(event.target?.result?.toString());
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <AudioPlayer
                src={songAudio}
                autoPlay={false}
                autoPlayAfterSrcChange={false}
              />
            </Stack>

            {autoComplete.map((e, index) => {
              return (
                <Autocomplete
                  key={index}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  multiple={e.multiple}
                  id={e.id}
                  options={e.options}
                  filterSelectedOptions
                  value={e.value}
                  onChange={(event, v) => {
                    e.onChange(v);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={e.label}
                      placeholder={e.placeholder}
                    />
                  )}
                />
              );
            })}
            <TextField
              id="description"
              multiline={true}
              rows={2}
              label="Mô tả"
              variant="outlined"
              value={songDes ?? ''}
              onChange={(e) => setSongDes(e.target.value)}
            />
            <TextField
              id="lyric"
              multiline={true}
              label="Lời"
              variant="outlined"
              value={songLyric ?? ''}
              rows={3}
              onChange={(e) => setSongLyric(e.target.value)}
            />
          </Stack>
          <Divider sx={{ marginTop: '10px' }} />
          <Stack
            direction={'row'}
            spacing={2}
            justifyContent={'end'}
            paddingTop={2}
          >
            <Button variant="outlined" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                uploadFile();
              }}
            >
              Lưu
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </div>
  );
};

export default SongModal;

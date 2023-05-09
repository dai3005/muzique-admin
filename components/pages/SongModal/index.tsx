import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Stack
} from '@mui/material';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { Album } from '@muzique/models/Album';
import { Artist } from '@muzique/models/Artist';
import { Genre } from '@muzique/models/Genre';
import { Playlist } from '@muzique/models/Playlist';
import { Song, SongDetail } from '@muzique/models/Song';
import { promises } from 'dns';
import { forEach } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

type Props = {
  song?: SongDetail;
  open: boolean;
  handleClose: () => void;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

type Option = {
  value: number;
  label: string;
};

const SongModal: FC<Props> = ({ song, open, handleClose }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [listArtists, setListArtists] = useState(song?.listArtistId ?? []);
  const [listGenre, setListGenre] = useState(song?.listGenreId ?? []);
  const [listPlaylist, setListPlaylist] = useState(song?.listPlaylistId ?? []);
  const [albumId, setAlbumId] = useState(song?.song.albumId ?? 0);

  console.log(listArtists);
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

  const autoComplete: {
    label: string;
    placeholder: string;
    multiple: boolean;
    options: Option[];
    value: Option | Option[];
    onChange: (value: Option | Option[] | null) => void;
  }[] = [
    {
      label: 'Album',
      placeholder: 'Chọn Album',
      multiple: false,
      options: albumOptions,
      value: {
        label: albumOptions.find((a) => a.value === albumId)?.label ?? '',
        value: albumId
      },
      onChange: (v) => setAlbumId((v as Option).value)
    },
    {
      label: 'Thể loại',
      placeholder: 'Chọn Thể loại',
      multiple: true,
      options: genreOptions,
      value:
        listGenre.map((l) => {
          return {
            label: artistOptions.find((a) => a.value === l)?.label ?? '',
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
      value:
        listArtists.map((l) => {
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
      value:
        listPlaylist.map((l) => {
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

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style} component={'form'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Tên bài hát"
            variant="outlined"
            value={song?.song.name}
          />
          {autoComplete.map((e) => {
            return (
              <Autocomplete
                key={e.label}
                isOptionEqualToValue={(a, b) => a.value === b.value}
                multiple={e.multiple}
                id="tags-outlined"
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
        </Stack>
      </Modal>
    </div>
  );
};

export default SongModal;

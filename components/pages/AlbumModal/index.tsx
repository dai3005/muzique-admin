import { Label } from '@mui/icons-material';
import {
  Modal,
  Stack,
  TextField,
  Typography,
  Divider,
  Button,
  Autocomplete
} from '@mui/material';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile, removeVietnameseTones } from '@muzique/helper/helper';
import { Album } from '@muzique/models/Album';
import { Artist } from '@muzique/models/Artist';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Props = {
  album?: Album;
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
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const AlbumModal: FC<Props> = ({ album, open, handleClose, reloadPage }) => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [artists, setArtists] = useState<Artist[]>([]);

  const [albumImage, setAlbumImage] = useState<string>();
  const [albumImgFile, setAlbumImgFile] = useState<File>();
  const [artist, setArtist] = useState<number>();

  useEffect(() => {
    apiCall({
      url: '/getListArtist',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        page: 1,
        rowperpage: 0
      }
    }).then((response) => {
      setArtists(response.data.listData);
    });
  }, []);

  useEffect(() => {
    if (album) {
      setName(album.name);
      setDescription(album.description);
      setAlbumImage(getFile(album.coverImageUrl));
      setArtist(album.artistId);
    }
  }, [album]);

  const uploadFile = () => {
    apiCall({
      url: '/uploadFile',
      method: 'post',
      headers: HEADER.multipartHeader,
      data: {
        fileImage: albumImgFile
      }
    }).then((response) => {
      if (response.status === 200) {
        if (album) {
          updateAlbum(response.data.filePathImage);
        } else {
          createAlbum(response.data.filePathImage);
        }
      }
    });
  };

  const createAlbum = (fileImg: string) => {
    apiCall({
      url: '/createAlbum',
      method: 'post',
      headers: HEADER.HEADER_DEFAULT,
      data: {
        albumId: 0,
        name: name,
        nameSearch: removeVietnameseTones(name ?? ''),
        description: description,
        coverImageUrl: fileImg,
        artistId: artist
      }
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Bạn đã tạo album này thành công!',
          preConfirm: function () {
            handleClose();
            reloadPage();
          }
        });
      }
    });
  };

  const updateAlbum = (fileImg: string) => {
    apiCall({
      url: '/updateAlbum',
      method: 'put',
      headers: HEADER.HEADER_DEFAULT,
      data: {
        albumId: album?.albumId,
        name: name,
        nameSearch: removeVietnameseTones(name ?? ''),
        description: description,
        coverImageUrl: fileImg,
        artistId: artist
      }
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Bạn đã sửa album này thành công!',
          preConfirm: function () {
            handleClose();
            reloadPage();
          }
        });
      }
    });
  };
  const artistOptions = artists.map((a) => {
    return { value: a.artistId, label: a.name };
  });
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
              label="Tên"
              variant="outlined"
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
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
                  setAlbumImgFile(e.target.files?.[0]);

                  let file = e.target.files?.[0];
                  let reader = new FileReader();
                  reader.onloadend = (event) => {
                    setAlbumImage(event.target?.result?.toString());
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
                src={albumImage}
                alt="img"
              />
            </Stack>
            <Autocomplete
              isOptionEqualToValue={(a, b) => a.value === b.value}
              id={'artist'}
              options={artistOptions}
              filterSelectedOptions
              getOptionLabel={(option) => option.label}
              value={{
                value: artist,
                label:
                  artistOptions.find((a) => a.value === artist)?.label ?? ''
              }}
              onChange={(event, v) => {
                setArtist(v?.value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Ca sĩ'}
                  placeholder={'Chọn ca sĩ'}
                />
              )}
            />
            <TextField
              id="description"
              multiline={true}
              rows={2}
              label="Mô tả"
              variant="outlined"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
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

export default AlbumModal;

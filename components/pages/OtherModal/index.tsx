import {
  Modal,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  Button
} from '@mui/material';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

type Props = {
  detail: any;
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

const OtherModal: FC<Props> = ({ detail, open, handleClose, reloadPage }) => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [imgFile, setImgFile] = useState<File>();
  const [objectImage, setObjectImage] = useState<string>();

  useEffect(() => {
    if (detail) {
      setName(detail.name);
      setDescription(detail.description);
      setObjectImage(getFile(detail.coverImageUrl));
    }
  }, [detail]);

  const uploadFile = () => {
    apiCall({
      url: '/uploadFile',
      method: 'post',
      headers: HEADER.multipartHeader,
      data: {
        fileImage: imgFile
      }
    }).then((response) => {
      if (response.status === 200) {
        if (detail) {
        } else {
        }
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
                  setImgFile(e.target.files?.[0]);

                  let file = e.target.files?.[0];
                  let reader = new FileReader();
                  reader.onloadend = (event) => {
                    setObjectImage(event.target?.result?.toString());
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
                src={objectImage}
                alt="img"
              />
            </Stack>
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

export default OtherModal;

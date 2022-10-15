import { WebviewWindow, appWindow } from '@tauri-apps/api/window'
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import IconButton from '@mui/material/IconButton';

const CustomTitleBarGroup = styled('div')(({ theme }) => ({
  background: 'rgba(255,255,255,0.0)',
  marginBottom: 4,
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
}));


export const CustomTitleBar = () => {

    const onSettingClicked = () => {
        const webview = new WebviewWindow('AppSetting', {
            title: 'minipomo settings',
            url: '/setting',
            height: 320,
            width: 480,
            resizable: false,
        })
    }

    const onMinimizeClicked = () => {
        appWindow.minimize();
    }

    const onCloseClicked = () => {
        appWindow.close();
        const mainWindow = WebviewWindow.getByLabel('AppSetting');
        if (mainWindow) {
            mainWindow.close();
        }
    }

    return (
    <CustomTitleBarGroup data-tauri-drag-region>

        <IconButton
            aria-label="settingbutton"
            sx={{ height: "16px", width: "16px", fontSize: "14px" }}
            onClick={onSettingClicked}>
            <SettingsIcon fontSize="inherit" />
        </IconButton>

        <IconButton
            aria-label="minimize"
            sx={{ marginLeft:"auto", height: "16px", width: "16px", fontSize: "14px" }}
            onClick={onMinimizeClicked}>
            <MinimizeIcon fontSize="inherit" />
        </IconButton>

        <IconButton
            aria-label="closebutton"
            sx={{ height: "16px", width: "16px", fontSize: "14px" }}
            onClick={onCloseClicked}>
            <CloseIcon fontSize="inherit" />
        </IconButton>

    </CustomTitleBarGroup>
    );
}


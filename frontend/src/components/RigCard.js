import {CardMedia, Card, CardContent, Typography} from '@mui/material';

export default function RigCard({rig}) {
    return (
        <Card sx={{height: '100%', minWidth: 500, minHeight: 380, display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1, p: 4}}>
                <Typography variant="h5" fontWeight='bold' gutterBottom>{rig.title}</Typography>
                <Typography variant="body2" fontWeight="semibold" color="text.secondary" paddingBottom="10px">{rig.description}</Typography>
                <CardMedia component="img" height="300" image={rig.imageUrl} alt={rig.title}/>
            </CardContent>
        </Card>
    );
}
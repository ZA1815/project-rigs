import {CardMedia, Card, CardContent, Typography} from '@mui/material';

export default function RigCard({rig}) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{rig.title}</Typography>
                <Typography variant="body2">{rig.description}</Typography>
                <CardMedia component="img" height="194" image={rig.imageUrl} alt={rig.title}/>
            </CardContent>
        </Card>
    );
}
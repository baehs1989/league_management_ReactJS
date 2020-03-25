import React from 'react';
import classes from './EmbedTwitter.module.css'

import { TwitterTimelineEmbed} from 'react-twitter-embed';
import { Paper} from '@material-ui/core'

export default function CenteredTabs(props) {

  return (
    <Paper>
        <div className={classes.Title}>Anouncements</div>
        <TwitterTimelineEmbed
            sourceType="profile"
            noHeader
            noFooter
            screenName="AlexBae83633467"
            options={{height: 400}}
        />
    </Paper>

  );
}

'use client'
// Subscription Button Component
import React from 'react';
import { Button } from './ui/button';
import axios from 'axios';
// Checks if the user uses pro version or not.
type Props = { isPro : boolean }

const SubscriptionButton = (props: Props) => {
    const [loading, setLoading] = React.useState(false);
    const handleSubscription = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stripe');
            // redirect to stripe page
            window.location.href = response.data.url;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button disabled={loading} onClick={handleSubscription}>
            {props.isPro ? "Manage Subscriptions" : "Get Pro"}
        </Button>
    )
}

export default SubscriptionButton;
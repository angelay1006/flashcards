import { useUser } from '@clerk/nextjs';

export const useNavbarPages = () => {
  const {isSignedIn} = useUser();

  // for stripe
  const handleCheckout = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const checkoutSessionJSON = await checkoutSession.json();

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJSON.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (err) {
      console.error('Error during checkout:', err);
    }
  };

  return [
    {name: 'Home', route: '/'},
    {name: 'Flashcards', route: isSignedIn ? '/flashcards' : '/sign-in'},
    {name: 'Create', route: '/generate'},
    {name: 'Subscribe', route: 'pricing'},
    {name: 'About', route: '/about'},
  ];
};
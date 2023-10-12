import React from 'react';
import { usePost } from '@src/state/post/postStore';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';
import { useRoute } from '@react-navigation/core';
import Markdown from '@components/Common/Markdown/Markdown';

function Post(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const post = usePost(postId);

  const mdString = `
  **Bold Text**

*Italic Text* then normal text **Then bold text!** then some more text [with a link](https://google.com)

a really long long long long long long long long long long long long long long line of text

 [a link that has a lot of text so it goes off the screen screen screen](https://google.com)

![an image](https://placehold.co/600x400/EEE/31343C)

# heading one
## heading two
### heading three
#### heading four
##### heading five?
###### heading six??

~~strike it out~~

> a dumb quote

> a quote
> thats multiline?

- some
- list
- for
- me

\`some code\`

\`\`\`
some
multiline
code
\`\`\`


::: spoiler spoiler
spoiler alert
:::

  `;

  return (
    <VStack>
      <Text>{post?.name}</Text>
      <Markdown>{mdString}</Markdown>
    </VStack>
  );
}

export default React.memo(Post);

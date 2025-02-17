import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { HandlerStateChangeEvent, ScrollView } from 'react-native-gesture-handler';

import Card, { cardMargin, cardWidth } from './Card';
import SliderIndicator from './SliderIndicator';
import { CardRepository } from '@/data/repository/card-repository';

const maxIndex = 3;

const getIndex = (position: number): number => {
  if (position >= maxIndex * cardWidth) {
    return maxIndex;
  }
  const baseIndex = Math.floor((position - 16) / (cardWidth + cardMargin));
  const offsetX = position - baseIndex * (cardWidth + cardMargin) - baseIndex * cardMargin;
  // (baseIndex - 1 < 0 ? 0 : (baseIndex - 1) * cardMargin);
  if (offsetX > cardWidth / 2) {
    return baseIndex + 1;
  }
  return baseIndex;
};

const getOffsetByIndex = (i: number): number => cardWidth * i + cardMargin * i;

const cardRepository = new CardRepository();

const CardList = () => {
  // const query = useQuery({
  //   queryKey: ['card'],
  //   async queryFn() {
  //     return cardRepository.getCards();
  //   },
  // });

  // const cards = query.data;
  // console.log('cards: ', cards);

  // const insert = useCallback(async () => {
  //   return cardRepository.createCard({
  //     number: '5320 4243 4342 5435',
  //     name: 'John Snow',
  //     type: 'Debit MasterCard Platinum',
  //     expiry: '12/2030',
  //     cvc: '123',
  //   });
  // }, []);

  // useEffect(() => {
  //   insert();
  // }, [insert]);

  const scrollRef = useRef<ScrollView>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = getIndex(e.nativeEvent.targetContentOffset?.x ?? 0);

    console.log('e.nativeEvent.contentOffset?.x: ', e.nativeEvent.velocity?.x)
    console.log('e.nativeEvent.targetContentOffset?.x: ', e.nativeEvent.targetContentOffset?.x)

    setCurrentIndex(index);

    // console.log('index: ', index);
    // console.log('x: ', offsetX);
    // scrollRef.current?.scrollTo({
    //   x: cardWidth * index,
    //   animated: true
    // });
  };

  const onMomentumScrollEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const snapToOffsets = useMemo(
    () => Array.from(Array(maxIndex), (_, i) => getOffsetByIndex(i)),
    [],
  );

  const onCancelled = (event: HandlerStateChangeEvent) => {
    // console.log('event:', event);
  };

  return (
    <View style={{ marginTop: 16 }}>
      <ScrollView
        style={{ paddingHorizontal: cardMargin }}
        ref={scrollRef}
        onCancelled={onCancelled}
        // onTouchCancel={onCancelled}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}>
        <Card index={0} />
        <Card index={1} />
        <Card index={2} />
        <Card index={3} last />
      </ScrollView>
      <SliderIndicator totalCount={maxIndex + 1} index={currentIndex} />
    </View>
  );
};

export default CardList;

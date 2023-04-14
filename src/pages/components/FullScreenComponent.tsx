import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  Center,
  Spacer,
} from "@chakra-ui/react";
import PolarPlot from "./PolarPlot";

interface FullScreenComponentProps {
  data: PMUDataProps[],
  option: any,
  handleOption: any
}

interface PMUDataProps {
  university: string;
  utcDate: string;
  ppaModule: number;
  ppaAngle: number;
  ppaStatusFlags: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phasorModule: number;
  phasorAngle: number;
  statusFlags: number;
  base: number;
}

const FullScreenComponent = ({ data, option, handleOption }: FullScreenComponentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
    onOpen();
  };

  const handleModalClose = () => {
    setIsFullScreen(false);
    onClose();
  };

  return (
    <Box>
      <Box onClick={handleFullScreenClick}>
        <PolarPlot data={data} option={option} width={400} height={400} />;
      </Box>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="full">
        <ModalOverlay style={{ backgroundColor: "cyan.400" }} />
        <ModalContent
          style={{
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
          }}
        >
          <Spacer />
          <ModalHeader>
            <Center>Gráfico Polar do SIN (Sistema Interligado Nacional)</Center>
          </ModalHeader>

          <ModalBody>
           
            <Center>
              <PolarPlot
                data={data}
                option={option}
                width={600}
                height={600}
                isOpen={isOpen}
              />
            </Center>
            <Center>
              <Select
                placeholder="Select"
                onChange={handleOption}
                value={option}
                bg="tomato"
                borderColor="tomato"
                color="white"
                width="200px"
              >
                {data && data.map((university) => {
                  return (
                    <option
                      value={university.university}
                      key={university.university}
                    >
                      {university.university}
                    </option>
                  );
                })}
              </Select>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleModalClose}>Fechar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FullScreenComponent;
